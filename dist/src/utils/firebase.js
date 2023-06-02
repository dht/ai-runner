"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDirectoryToStorage = exports.clearCollection = exports.addEvent = exports.patchRequest = exports.listenToChanges = exports.start = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert('./serviceAccountKey.json'),
});
const db = firebase_admin_1.default.firestore();
exports.start = {};
const listenToChanges = (documentName, callback) => {
    const collectionRef = db.collection(documentName);
    return collectionRef.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            callback(change.doc, change.type);
        });
    });
};
exports.listenToChanges = listenToChanges;
const patchRequest = (id, change) => {
    let bulkWriter = db.bulkWriter();
    let rootRef = db.collection('requests').doc(id);
    bulkWriter.update(rootRef, change);
    return bulkWriter.close().then(() => {
        console.log('request patched');
    });
};
exports.patchRequest = patchRequest;
const addEvent = (id, event) => {
    let bulkWriter = db.bulkWriter();
    let rootRef = db.collection('requests').doc(id);
    const eventRef = rootRef.collection('items');
    const timestamp = Date.now() - exports.start[id];
    bulkWriter.create(eventRef.doc(), {
        ...event,
        timestamp,
    });
    return bulkWriter.close().then(() => {
        console.log('event added');
    });
};
exports.addEvent = addEvent;
// clear all collection
const clearCollection = async (collectionPath) => {
    const collectionRef = db.collection(collectionPath);
    await db.recursiveDelete(collectionRef);
    return collectionRef.get().then(async (snapshot) => {
        for (let doc of snapshot.docs) {
            await db.recursiveDelete(doc.ref);
        }
    });
};
exports.clearCollection = clearCollection;
const uploadDirectoryToStorage = async (directoryPath) => {
    const bucket = firebase_admin_1.default.storage().bucket(process.env.STORAGE_BUCKET);
    const directory = await fs_1.default.promises.opendir(directoryPath);
    const promises = [];
    for await (const file of directory) {
        const filePath = `${directoryPath}/${file.name}`;
        const destination = `${directoryPath.replace('./output', '')}/${file.name}`;
        const promise = bucket.upload(filePath, {
            destination,
            gzip: true,
            public: true,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
        });
        promises.push(promise);
    }
    return Promise.all(promises);
};
exports.uploadDirectoryToStorage = uploadDirectoryToStorage;
