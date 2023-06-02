export declare class Logger {
    private debug;
    timer: Record<string, number>;
    lines: string[];
    constructor(debug?: boolean);
    time(message: string): void;
    timeEnd(message: string): void;
    toString(): string;
}
