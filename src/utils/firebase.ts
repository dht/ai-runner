import admin from 'firebase-admin';
import fs from 'fs';
import { IEvent, Json } from '../../_archive/types';

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
});

const db = admin.firestore();

export const start: Record<string, number> = {};

export type Callback = (doc: any, changeType: string) => void;

export const listenToChanges = (documentName: string, callback: Callback) => {
  const collectionRef = db.collection(documentName);

  return collectionRef.onSnapshot((snapshot: any) => {
    snapshot.docChanges().forEach((change: any) => {
      callback(change.doc, change.type);
    });
  });
};

export const patchRequest = (id: string, change: Json) => {
  let bulkWriter = db.bulkWriter();
  let rootRef = db.collection('requests').doc(id);

  bulkWriter.update(rootRef, change);

  return bulkWriter.close().then(() => {
    console.log('request patched');
  });
};

export const addEvent = (id: string, event: IEvent) => {
  let bulkWriter = db.bulkWriter();
  let rootRef = db.collection('requests').doc(id);

  const eventRef = rootRef.collection('items');

  const timestamp = Date.now() - start[id];

  bulkWriter.create(eventRef.doc(), {
    ...event,
    timestamp,
  });

  return bulkWriter.close().then(() => {
    console.log('event added');
  });
};

// clear all collection
export const clearCollection = async (collectionPath: string) => {
  const collectionRef = db.collection(collectionPath);

  await db.recursiveDelete(collectionRef);

  return collectionRef.get().then(async (snapshot) => {
    for (let doc of snapshot.docs) {
      await db.recursiveDelete(doc.ref);
    }
  });
};

export const uploadDirectoryToStorage = async (directoryPath: string) => {
  const bucket = admin.storage().bucket(process.env.STORAGE_BUCKET);

  const directory = await fs.promises.opendir(directoryPath);

  const promises: Promise<any>[] = [];

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
