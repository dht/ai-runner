import { eleven, openAi } from './ai-kit';
import { extraVoices } from './_archive/data.voices';
import { ConversationMaker } from './utils/conversation.maker';
import fs from 'fs-extra';

export const run = async () => {
    const instructions = fs.readJsonSync('./instructions.json');
    const response = await openAi.followInstructions(instructions);

    fs.writeJsonSync('./instructions.response.json', response);
};
