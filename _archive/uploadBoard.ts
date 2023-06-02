import { config } from 'dotenv-flow';
import { eleven, openAi } from '../src/ai-kit';
import { extraVoices } from './data.voices';
import { run as runInstructions } from './run.instructions';
import { uploadDirectoryToStorage } from '../src/utils/firebase';
// import { run as runConversation } from './run.conversation';

config();

const run = async () => {
    console.time('uploadDirectoryToStorage');
    uploadDirectoryToStorage('boards');
    console.timeEnd('uploadDirectoryToStorage');
};

run();
