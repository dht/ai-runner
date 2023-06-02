import { config } from 'dotenv-flow';
import { eleven, openAi } from '../src/ai-kit';
import { extraVoices } from './data.voices';
import { run as runInstructions } from './run.instructions';
// import { run as runConversation } from './run.conversation';

config();

const run = async () => {
    eleven.init(process.env.ELEVEN_LABS_API_KEY!, extraVoices);
    openAi.init(process.env.OPEN_AI_API_KEY!, process.env.OPEN_AI_ORGANIZATION!); // prettier-ignore
    runInstructions();
};

run();
