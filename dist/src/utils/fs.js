"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsJsonFile = exports.deleteJsonFile = exports.patchJsonFile = exports.writeJsonFile = exports.readJsonFile = exports.patchEnv = exports.getEnv = exports.patchConfig = exports.getConfig = exports.validateConfig = void 0;
const fs = __importStar(require("fs-extra"));
const os = __importStar(require("os"));
const questions_1 = require("./questions");
const ROOT = `${os.homedir()}/.ai-runner`;
const paths = {
    config: `${ROOT}/config.json`,
    env: `${ROOT}/env.json`,
};
const validateConfig = async () => {
    fs.ensureDirSync(ROOT);
    fs.ensureFileSync(paths.config);
    fs.ensureFileSync(paths.env);
    const config = (0, exports.getConfig)();
    if (!config.envPath) {
        const response = await (0, questions_1.askQuestions)([
            {
                name: 'envPath',
                message: 'Path to save OpenAI/ElevenLabs API key',
                initial: `${ROOT}/.env`,
                type: 'Input',
            },
        ]);
        console.log('response ->', response);
    }
};
exports.validateConfig = validateConfig;
const getConfig = () => {
    return (0, exports.readJsonFile)(paths.config) ?? {};
};
exports.getConfig = getConfig;
const patchConfig = (change) => {
    (0, exports.patchJsonFile)(paths.config, change);
};
exports.patchConfig = patchConfig;
const getEnv = () => {
    return fs.readJsonSync(paths.env) ?? {};
};
exports.getEnv = getEnv;
const patchEnv = (change) => {
    (0, exports.patchJsonFile)(paths.env, change);
};
exports.patchEnv = patchEnv;
// ============== general JSON file utils ==============
const readJsonFile = (filePath) => {
    try {
        return fs.readJsonSync(filePath);
    }
    catch (err) {
        return {};
    }
};
exports.readJsonFile = readJsonFile;
const writeJsonFile = (filePath, json) => {
    fs.writeJsonSync(filePath, json, { spaces: 2 });
};
exports.writeJsonFile = writeJsonFile;
const patchJsonFile = (filePath, change) => {
    const json = (0, exports.readJsonFile)(filePath);
    const newJson = { ...json, ...change };
    (0, exports.writeJsonFile)(filePath, newJson);
};
exports.patchJsonFile = patchJsonFile;
const deleteJsonFile = (filePath) => {
    fs.removeSync(filePath);
};
exports.deleteJsonFile = deleteJsonFile;
const existsJsonFile = (filePath) => {
    return fs.existsSync(filePath);
};
exports.existsJsonFile = existsJsonFile;
