"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guid4 = exports.guid = void 0;
const guid = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return `${s4()}-${s4()}-${s4()}-${s4()}`;
};
exports.guid = guid;
const guid4 = () => {
    return (0, exports.guid)().slice(0, 4);
};
exports.guid4 = guid4;
