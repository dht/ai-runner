"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(debug = false) {
        this.debug = debug;
        this.timer = {};
        this.lines = [];
    }
    time(message) {
        this.timer[message] = Date.now();
        if (!this.debug) {
            return;
        }
        console.time(message);
    }
    timeEnd(message) {
        const delta = Date.now() - this.timer[message];
        if (!this.debug) {
            return;
        }
        console.timeEnd(message);
        const deltaText = delta > 1000 ? `${delta / 1000}s` : `${delta}ms`;
        this.lines.push(`${message}: ${deltaText}ms`);
    }
    toString() {
        return this.lines.join('\n');
    }
}
exports.Logger = Logger;
