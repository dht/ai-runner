export declare type Json = Record<string, any>;
export declare type IConversationTranscript = {
    id: string;
    raw: string;
    sentences: IConversationSentence[];
};
export declare type IConversationSentence = {
    id: string;
    text: string;
    speakerName: string;
    voice?: IVoice;
    textPhonetics?: string;
    audioUrl?: string;
};
export declare type IVoice = {
    id: string;
    name: string;
};
export declare type InstructionsType = 'prepare-dataset';
export declare type InstructionsFormat = 'csv' | 'json';
export declare type IInstructions = {
    instructionType: InstructionsType;
    format: InstructionsFormat;
    ability: string;
    columns: string[];
};
export declare type IRequest = {
    id: string;
    prompt: string;
    ip: string;
    boardId: string;
    debugModeOn?: boolean;
};
export declare type IEvent = {
    source: string;
    verb: string;
    message: string;
    data?: Json;
};
