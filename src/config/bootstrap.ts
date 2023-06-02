import * as fs from 'fs-extra';
import * as os from 'os';
import { delay } from '../utils/delay';
import { logJson, logger } from '../utils/logger';
import { askQuestions } from '../utils/questions';
import { patchJsonFile, readJsonFile } from '../utils/fs';
import { Json } from '../types';
import defaults from './defaults.json';
import { askApiKey, askEnvPath, askPort } from './bootstrap.questions';
import * as openAI from '../ai/ai.openAI';
import * as elevenLabs from '../ai/ai.elevenLabs';

const ROOT = defaults.root;

const root = ROOT.replace('~', os.homedir());

const paths = {
  config: `${root}/config.json`,
  env: `${root}/env.json`,
};

export const validateConfig = async () => {
  logger.info(`Validating ROOT exist in ${ROOT}`);
  fs.ensureDirSync(ROOT);
  logger.info(`Validating config exist in ${ROOT}/config.json`);
  fs.ensureFileSync(paths.config);

  let config = getConfig();

  if (!config.envPath) {
    await delay(500);
    const envPath = await askEnvPath();
    patchConfig({ envPath });
  }

  config = getConfig();

  logger.info(`Validating env exist in ${config.envPath}`);
  fs.ensureFileSync(config.envPath);

  const env = getEnv();

  if (!env.openAiKey) {
    await delay(500);
    const key = await askApiKey('OpenAI');
    patchEnv({ openAiKey: key });
  }

  openAI.init(env.openAiKey);

  if (!env.elevenLabsKey) {
    await delay(500);
    const key = await askApiKey('ElevenLabs');
    patchEnv({ elevenLabsKey: key });
  }

  elevenLabs.init(env.elevenLabsKey);

  if (!config.port) {
    await delay(500);
    const key = await askPort();
    patchConfig({ port: key });
  }

  const keysCount = Object.keys(env).length;

  await delay(500);

  logJson({
    root,
    ...config,
    keys: keysCount,
  });
};

export const getConfigParam = (param: string) => {
  return getConfig()[param];
};

export const setConfigParam = (param: string, value: Json) => {
  return patchConfig({ [param]: value });
};

export const patchConfigParam = (param: string, change: Json) => {
  const value = getConfigParam(param);
  const newValue = { ...value, ...change };
  setConfigParam(param, newValue);
};

export const getConfig = () => {
  return readJsonFile(paths.config) ?? {};
};

export const patchConfig = (change: Json) => {
  patchJsonFile(paths.config, change);
};

export const getEnv = () => {
  return readJsonFile(paths.env) ?? {};
};

export const patchEnv = (change: Json) => {
  patchJsonFile(paths.env, change);
};
