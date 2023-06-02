import { getModels } from './ai/ai.openAI';
import { getConfig, validateConfig } from './config/bootstrap';
import { start } from './express/express';
import { Json } from './types';
import { writeJsonFile } from './utils/fs';
import { askQuestions } from './utils/questions';

const run = async () => {
  await validateConfig();

  const config = getConfig();

  start(config.port);

  const models = await getModels();
  writeJsonFile('./models.json', models as Json);
};

run();
