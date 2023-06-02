"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batch = exports.getVoice = exports.getVoices = exports.speakTranscript = exports.speak = exports.init = exports.getVoiceNames = exports.getVoiceMap = void 0;
const axios_1 = __importDefault(require("axios"));
let instance;
let nameToIds = {
    rachel: '21m00Tcm4TlvDq8ikWAM',
    domi: 'AZnzlk1XvdvUeBnXmlld',
    bella: 'EXAVITQu4vr4xnSDxMaL',
    antoni: 'ErXwobaYiN019PkySvjV',
    elli: 'MF3mGyEYCl7XYWbV9V6O',
    josh: 'TxGEqnHWrfWFTfGW9XjX',
    arnold: 'TxGEqnHWrfWFTfGW9XjX',
    adam: 'pNInz6obpgDQGcFmaJgB',
    sam: 'yoZ06aMxZJJ28mfd3POQ',
};
const getVoiceMap = () => nameToIds;
exports.getVoiceMap = getVoiceMap;
const getVoiceNames = () => Object.keys(nameToIds);
exports.getVoiceNames = getVoiceNames;
const voiceDefault = 'rachel';
const init = (apiKey, extraVoices) => {
    instance = axios_1.default.create({
        baseURL: 'https://api.elevenlabs.io/v1',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    instance.interceptors.request.use((config) => {
        config.headers = {
            ...config.headers,
            'xi-api-key': apiKey,
        };
        return config;
    });
    nameToIds = {
        ...nameToIds,
        ...extraVoices,
    };
    return instance;
};
exports.init = init;
let index = 0;
const speak = async (text, voiceNameOrId = voiceDefault) => {
    const voiceId = nameToIds[voiceNameOrId.toLowerCase()] || voiceNameOrId;
    if (!voiceId) {
        console.log('No voiceId provided');
        return;
    }
    await delay(index++ * 1000);
    return instance.post(`/text-to-speech/${voiceId}`, {
        text,
        voice_settings: {
            stability: 0,
            similarity_boost: 0,
        },
    }, {
        responseType: 'arraybuffer',
        headers: {
            accept: 'audio/mpeg',
        },
    });
};
exports.speak = speak;
const delay = (millis) => new Promise((resolve) => setTimeout(resolve, millis));
const speakTranscript = async (transcript) => {
    const { sentences } = transcript;
    const promises = sentences
        .map((sentence) => {
        const { speakerName } = sentence;
        const voice = {
            id: nameToIds[speakerName.toLowerCase()],
            name: speakerName,
        };
        return {
            ...sentence,
            voice,
        };
    })
        .map((sentence) => {
        const { text, voice } = sentence;
        return (0, exports.speak)(text, voice.id);
    });
    const responses = await Promise.all(promises);
    return responses
        .map((response) => response && response.data)
        .filter((i) => i);
};
exports.speakTranscript = speakTranscript;
const getVoices = async () => {
    let response;
    try {
        response = await instance.get('/voices');
        return response.data;
    }
    catch (err) {
        errorHandling(err);
    }
};
exports.getVoices = getVoices;
const getVoice = async (voiceId) => {
    let response;
    try {
        response = await instance.get(`/voices/${voiceId}`);
        return response.data;
    }
    catch (err) {
        errorHandling(err);
    }
};
exports.getVoice = getVoice;
const batch = (inputs, method) => {
    const promises = inputs.map((input) => method(input));
    return Promise.all(promises);
};
exports.batch = batch;
const errorHandling = (err) => {
    if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
    else {
        console.log(err.message);
    }
};
