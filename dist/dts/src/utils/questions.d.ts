import { Questions } from './questions.types';
export declare const autoComplete: (message: string, choices: string[]) => Promise<any>;
export declare const boolean: (message: string) => Promise<any>;
export declare const askQuestions: (questions: Questions) => Promise<object>;
