import * as fs from 'fs-extra';
import { Json } from '../types';

// ============== general JSON file utils ==============
export const readJsonFile = (filePath: string) => {
  try {
    return fs.readJsonSync(filePath);
  } catch (err: any) {
    return {};
  }
};

export const writeJsonFile = (filePath: string, json: Json) => {
  fs.writeJsonSync(filePath, json, { spaces: 2 });
};

export const patchJsonFile = (filePath: string, change: Json) => {
  const json = readJsonFile(filePath);
  const newJson = { ...json, ...change };
  writeJsonFile(filePath, newJson);
};

export const deleteJsonFile = (filePath: string) => {
  fs.removeSync(filePath);
};

export const existsJsonFile = (filePath: string) => {
  return fs.existsSync(filePath);
};
