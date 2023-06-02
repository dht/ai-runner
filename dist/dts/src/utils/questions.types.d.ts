export declare type Choice = {
    id: string;
    label: string;
};
export declare type Question = {
    name: string;
    message?: string;
    type?: 'AutoComplete' | 'BasicAuth' | 'Confirm' | 'Editable' | 'Form' | 'Input' | 'Invisible' | 'List' | 'MultiSelect' | 'Numeral' | 'Password' | 'Scale' | 'Select' | 'Snippet' | 'Sort' | 'Survey' | 'Text' | 'Toggle' | 'Quiz';
    limit?: number;
    selectedId?: string;
    choices?: Choice[];
    optional?: boolean;
    showIds?: boolean;
    initial?: string | InitialMethod;
    validation?: 'email' | 'url';
};
export declare type InitialMethod = (instance: any) => string;
export declare type Questions = Question[];
