export type Json = Record<string, any>;

export type IConversationTranscript = {
    id: string;
    raw: string;
    sentences: IConversationSentence[];
};

export type IConversationSentence = {
    id: string;
    text: string;
    speakerName: string;
    voice?: IVoice;
    textPhonetics?: string;
    audioUrl?: string;
};

export type IVoice = {
    id: string;
    name: string;
};

export type InstructionsType = 'prepare-dataset';
export type InstructionsFormat = 'csv' | 'json';

export type IInstructions = {
    instructionType: InstructionsType;
    format: InstructionsFormat;
    ability: string;
    columns: string[];
};

export type IRequest = {
    id: string;
    prompt: string;
    ip: string;
    boardId: string;
    debugModeOn?: boolean;
};

export type IEvent = {
    source: string;
    verb: string;
    message: string;
    data?: Json;
};
