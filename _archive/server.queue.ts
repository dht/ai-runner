import { config } from 'dotenv';
import { eleven, openAi } from './ai-kit';
import { extraVoices } from './_archive/data.voices';
import { IRequest, Json } from './types';
import { ConversationMaker } from './utils/conversation.maker';
import { timestamp } from './utils/date';
import {
    addEvent,
    patchRequest,
    start,
    uploadDirectoryToStorage,
} from './utils/firebase';
import { guid4 } from './utils/guid';

config({ path: '.env' });

export const queue: IRequest[] = [];
export let isRunning = false;
export let isLocal = false;

export const setQueueMode = (local: boolean) => {
    isLocal = local;
};

export const addRequestToQueue = (request: IRequest) => {
    start[request.id] = timestamp();

    const queueSize = queue.length + (isRunning ? 1 : 0);

    addEvent(request.id, {
        message: `request received (${queueSize} in queue)`,
        source: 'server',
        verb: 'received',
        data: {},
    });

    queue.push(request);
};

eleven.init(process.env.ELEVEN_LABS_API_KEY!, extraVoices);
openAi.init(process.env.OPEN_AI_API_KEY!, process.env.OPEN_AI_ORGANIZATION!); // prettier-ignore

export const handleQueue = async () => {
    console.log('queue size ->', queue.length);

    if (queue.length === 0) {
        setTimeout(handleQueue, 1000);
        return;
    }

    isRunning = true;

    const request = queue.shift();

    const log = (source: string, message: string, data: Json = {}) => {
        addEvent(request!.id, {
            source,
            verb: data.verb ?? 'log',
            message,
            ...data,
        });
    };

    log('server', 'handling request', {
        isRunning: true,
    });

    const audienceNames = '3 students';
    const voiceNames = ['arnold', 'rachel', 'sam'];
    const extraInstructions = '';

    const transcriptId = guid4();

    patchRequest(request!.id, {
        transcriptId,
    });

    const topic = request?.prompt ?? '';

    if (!topic) {
        console.log('no prompt');
        return;
    }

    console.table({
        transcriptId,
        topic,
        audienceNames,
        voiceNames: voiceNames.join(', '),
    });

    const conversationMaker = new ConversationMaker(
        transcriptId,
        {
            topic,
            participantsDescription: audienceNames,
            participantsNames: voiceNames,
            extraInstructions,
            debugModeOn: request?.debugModeOn,
        },
        {
            transcriptExists: false,
            log,
        }
    );

    log('server', 'making conversation', { isRunning: true });
    await conversationMaker.make();
    log('server', 'making conversation', { isRunning: false });

    log('storage', 'uploading files', { isRunning: true });
    const responses = await uploadDirectoryToStorage(
        `./output/transcript-${transcriptId}`
    );
    log('storage', 'uploading files', { isRunning: false });

    patchRequest(request!.id, {
        transcriptId,
    });

    log('server', 'handling request', {
        isRunning: false,
    });

    isRunning = false;

    log('server', 'generation completed', {
        verb: 'done',
    });

    setImmediate(handleQueue);
};
