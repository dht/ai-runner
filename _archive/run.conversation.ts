import { eleven, openAi } from '../src/ai-kit';
import { extraVoices } from './data.voices';
import { ConversationMaker } from './utils/conversation.maker';

export const run = async () => {
    const args = process.argv.slice(2);
    const [transcriptId, ...others] = args;
    const topic = others.join(' ');

    eleven.init(process.env.ELEVEN_LABS_API_KEY!, extraVoices);
    openAi.init(process.env.OPEN_AI_API_KEY!, process.env.OPEN_AI_ORGANIZATION!); // prettier-ignore

    const audienceNames = '3 students';
    const voiceNames = ['arnold', 'rachel', 'sam'];
    const extraInstructions = '';

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
        },
        {
            transcriptExists: false,
        }
    );
    await conversationMaker.make();
};
