import { AxiosInstance } from 'axios';
import { IConversationTranscript, Json } from '../../_archive/types';
export declare const getVoiceMap: () => Json;
export declare const getVoiceNames: () => string[];
export declare const init: (apiKey: string, extraVoices: Json) => AxiosInstance;
export declare const speak: (text: string, voiceNameOrId?: string) => Promise<import("axios").AxiosResponse<any, any> | undefined>;
export declare const speakTranscript: (transcript: IConversationTranscript) => Promise<any[]>;
export declare const getVoices: () => Promise<any>;
export declare const getVoice: (voiceId: string) => Promise<any>;
export declare const batch: (inputs: any[], method: any) => Promise<any[]>;
