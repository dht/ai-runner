"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
const DELAY = -1000;
const timestamp = () => {
    return Date.now() + DELAY;
};
exports.timestamp = timestamp;
