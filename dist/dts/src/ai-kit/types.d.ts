export declare type Json = Record<string, any>;
export declare type IConversationDefinition = {
    topic: string;
    participantsDescription: string;
    participantsNames: string[];
    extraInstructions?: string;
    debugModeOn?: boolean;
};
