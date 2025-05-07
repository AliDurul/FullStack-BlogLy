"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransporter = getTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("./env");
let transporter = null;
function getTransporter() {
    if (!transporter) {
        transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: env_1.ENV.emailUser,
                pass: env_1.ENV.emailPass,
            },
        });
    }
    return transporter;
}
//# sourceMappingURL=nodemailer.js.map