"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batch = exports.parseResponse = exports.improveConversation = exports.question = exports.listModels = exports.phoneticsTranscript = exports.followInstructions = exports.phonetics = exports.makeConversation = exports.chatCompletion = exports.completion = exports.whisper = exports.init = void 0;
const openai_1 = require("openai");
let instance;
const init = (apiKey, organization) => {
    const configuration = new openai_1.Configuration({
        organization,
        apiKey,
    });
    instance = new openai_1.OpenAIApi(configuration);
};
exports.init = init;
const errorHandling = (err) => {
    if (err.response) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
    else {
        console.log(err.message);
    }
};
const whisper = async (stream) => {
    let response;
    try {
        response = await instance.createTranscription(stream, 'whisper-1', '', 'srt');
        return response.data;
    }
    catch (err) {
        errorHandling(err);
        return;
    }
};
exports.whisper = whisper;
const completion = async (prompt) => {
    let response;
    try {
        response = await instance.createCompletion({
            model: 'text-davinci-003',
            prompt,
        });
    }
    catch (err) {
        errorHandling(err);
        return;
    }
    return response.data;
};
exports.completion = completion;
const chatCompletion = async (messages, model = 'gpt-3.5-turbo') => {
    let response;
    try {
        response = await instance.createChatCompletion({
            model,
            messages,
        });
    }
    catch (err) {
        errorHandling(err);
        return;
    }
    return response.data;
};
exports.chatCompletion = chatCompletion;
const makeConversation = async (definition) => {
    const { participantsDescription, participantsNames, topic, debugModeOn } = definition;
    const participants = `${participantsDescription} (${participantsNames.join(', ')})`; // prettier-ignore
    const instructions = [
        'generate a conversation between',
        participants,
        'about',
        topic,
        debugModeOn && 'one sentence per participant.',
    ];
    const response = await (0, exports.chatCompletion)([
        {
            role: 'user',
            content: instructions.join('\n'),
        },
    ]);
    return response;
};
exports.makeConversation = makeConversation;
const phonetics = async (sentence) => {
    try {
        const response = await (0, exports.chatCompletion)([
            {
                role: 'user',
                content: `can you turn the following paragraph into phonetics?\n"${sentence}"`,
            },
        ]);
        return (0, exports.parseResponse)(response);
    }
    catch (err) {
        return '';
    }
};
exports.phonetics = phonetics;
const followInstructions = async (instructions) => {
    const { instructionType, ability, columns, format } = instructions;
    let prompt = ['can you'];
    switch (instructionType) {
        case 'prepare-dataset':
            prompt.push('prepare a dataset to train an ai model');
        default:
    }
    prompt.push(`to ${ability}`);
    prompt.push(`use these columns: ${columns.join(', ')}`);
    prompt.push(`format: ${format}`);
    try {
        const response = await (0, exports.chatCompletion)([
            {
                role: 'user',
                content: prompt.join('\n'),
            },
        ], 'gpt-4');
        return (0, exports.parseResponse)(response);
    }
    catch (err) {
        return '';
    }
};
exports.followInstructions = followInstructions;
const phoneticsTranscript = async (transcript) => {
    const { sentences } = transcript;
    const promises = sentences.map((sentence) => {
        const { text } = sentence;
        return (0, exports.phonetics)(text);
    });
    const responses = await Promise.all(promises);
    return sentences.map((sentence, index) => {
        const response = responses[index];
        return {
            ...sentence,
            textPhonetics: response,
        };
    });
};
exports.phoneticsTranscript = phoneticsTranscript;
const listModels = async () => {
    try {
        const response = await instance.listModels();
        return response.data;
    }
    catch (err) {
        errorHandling(err);
        return;
    }
};
exports.listModels = listModels;
const question = async (q) => {
    const response = await (0, exports.chatCompletion)([
        {
            role: 'user',
            content: q,
        },
    ]);
    return (0, exports.parseResponse)(response);
};
exports.question = question;
const improveConversation = async (transcript, instructions) => {
    try {
        const response = await (0, exports.chatCompletion)([
            {
                role: 'user',
                content: `${instructions}\n"${transcript}"`,
            },
        ], 'gpt-4');
        return (0, exports.parseResponse)(response);
    }
    catch (err) {
        return '';
    }
};
exports.improveConversation = improveConversation;
const parseResponse = (response) => {
    return response.choices[0].message.content;
};
exports.parseResponse = parseResponse;
const batch = (inputs, method) => {
    const promises = inputs.map((input) => method(input));
    return Promise.all(promises);
};
exports.batch = batch;
