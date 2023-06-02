import { addRequestToQueue, handleQueue, setQueueMode } from './server.queue';
import { listenToChanges } from './utils/firebase';

setQueueMode(false);

// Start listening to document changes
const unsubscribe = listenToChanges(
    'requests',
    (doc: any, changeType: string) => {
        const now = Date.now();
        const createTimeRaw = doc.createTime;
        const createTime = new Date(
            createTimeRaw.seconds * 1000 + createTimeRaw.nanoseconds / 1000000
        );
        const age = now - createTime.getTime();

        if (changeType !== 'added') {
            return;
        }

        if (age > 5000) {
            return;
        }

        addRequestToQueue({
            id: doc.id,
            ...doc.data(),
        });
    }
);

handleQueue();

process.on('SIGINT', () => {
    console.log('SIGINT');
    unsubscribe();
    process.exit();
});

// restart on crash
