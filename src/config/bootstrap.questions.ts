import * as os from 'os';
import { Json } from '../types';
import { askQuestions } from '../utils/questions';
import defaults from './defaults.json';

export const askApiKey = async (provider: string) => {
  const answers = await askQuestions([
    {
      name: 'key',
      message: `${provider} API Key`,
      type: 'Input',
    },
  ]);

  const { key } = answers as Json;

  return key;
};

export const askEnvPath = async () => {
  const answers = await askQuestions([
    {
      name: 'value',
      message: 'Path to save your OpenAI/ElevenLabs API keys',
      initial: `${defaults.root}/env.json`,
      type: 'Input',
    },
  ]);

  const { value } = answers as Json;

  return value.replace('~', os.homedir());
};

export const askPort = async () => {
  const answers = await askQuestions([
    {
      name: 'value',
      message: 'Port to run the server on',
      initial: String(defaults.port),
      type: 'Numeral',
    },
  ]);

  const { value } = answers as Json;
  return value;
};
