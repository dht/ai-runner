"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("./utils/fs");
const run = async () => {
    await (0, fs_1.validateConfig)();
};
run();
