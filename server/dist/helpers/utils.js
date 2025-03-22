"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.SetToken = exports.generateUsername = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const generateUsername = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let username = email.split('@')[0];
    let isUnique = yield user_1.default.exists({ 'personal_info.username': username });
    isUnique ? username += Math.floor(Math.random() * 1000) : '';
    return username;
});
exports.generateUsername = generateUsername;
const SetToken = (user, isRefresh = false) => {
    const { user_id, _id, personal_info: { profile_img, username, fullname } } = user;
    const payload = {
        _id,
        user_id,
        profile_img,
        username,
        fullname
    };
    // JWT:
    if (!process.env.ACCESS_KEY || !process.env.REFRESH_KEY) {
        throw new Error('Environment variables ACCESS_KEY and REFRESH_KEY must be defined');
    }
    const access = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_KEY, { expiresIn: '1d' });
    const refresh = isRefresh ? null : jsonwebtoken_1.default.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: '3d' });
    return { error: false, access, refresh };
};
exports.SetToken = SetToken;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=utils.js.map