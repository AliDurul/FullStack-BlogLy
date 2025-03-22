"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const keyCode = process.env.SECRET_KEY, loopCount = 1000, charCount = 32, encType = 'sha512';
const passwordEncrypt = (password) => {
    if (!keyCode) {
        throw new Error('SECRET_KEY is not defined in the environment variables');
    }
    return (0, node_crypto_1.pbkdf2Sync)(password, keyCode, loopCount, charCount, encType).toString('hex');
};
exports.default = passwordEncrypt;
//# sourceMappingURL=passwordEncrypt.js.map