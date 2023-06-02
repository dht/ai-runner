import { IEvent, Json } from '../../_archive/types';
export declare const start: Record<string, number>;
export declare type Callback = (doc: any, changeType: string) => void;
export declare const listenToChanges: (documentName: string, callback: Callback) => () => void;
export declare const patchRequest: (id: string, change: Json) => Promise<void>;
export declare const addEvent: (id: string, event: IEvent) => Promise<void>;
export declare const clearCollection: (collectionPath: string) => Promise<void>;
export declare const uploadDirectoryToStorage: (directoryPath: string) => Promise<any[]>;
