"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.CustomError = void 0;
exports.passwordEncrypt = passwordEncrypt;
exports.setToken = setToken;
exports.shouldCompress = shouldCompress;
const node_crypto_1 = require("node:crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const compression_1 = __importDefault(require("compression"));
const nodemailer_1 = require("../configs/nodemailer");
const env_1 = require("../configs/env");
// ===============================
// 1. CUSTOM ERROR CLASS
// ===============================
class CustomError extends Error {
    name = "CustomError";
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = false) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
;
// ===============================
// 2. PASSWORD ENCRYPTION
// ===============================
function passwordEncrypt(pass) {
    const keyCode = env_1.ENV.secretKey;
    const loopCount = 10000;
    const charCount = 32;
    const encType = 'sha512';
    return (0, node_crypto_1.pbkdf2Sync)(pass, keyCode, loopCount, charCount, encType).toString('hex');
}
function setToken(user, isRefresh = false) {
    const { user_id, _id, isVerified, personal_info: { profile_img, username, fullname } } = user;
    const payload = {
        _id,
        user_id,
        profile_img,
        username,
        fullname,
        isVerified
    };
    return {
        success: true,
        access: jsonwebtoken_1.default.sign(payload, env_1.ENV.jwtSecret, { expiresIn: env_1.ENV.jwtExpiresIn }),
        refresh: isRefresh ? null : jsonwebtoken_1.default.sign({ _id: user._id }, env_1.ENV.jwtRefreshSecret, { expiresIn: env_1.ENV.jwtRefreshExpiresIn })
    };
}
;
const sendMail = async ({ to, subject, tempFn, data = null, from = null, text = null }) => {
    const transporter = (0, nodemailer_1.getTransporter)();
    const mailOptions = {
        from: from || { name: 'Your App', address: env_1.ENV.emailUser },
        to,
        subject,
        html: data ? tempFn(data) : tempFn(),
        text: text || undefined,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new CustomError(`Error sending email. Error ${error.message}`, 500, true);
    }
};
exports.sendMail = sendMail;
// ===============================
// 7. SHOULD COMPRESS
// ===============================
function shouldCompress(req, res) {
    if (req.headers['x-no-compression'] || req.query.nozip) {
        return false;
    }
    return compression_1.default.filter(req, res);
}
//# sourceMappingURL=common.js.map