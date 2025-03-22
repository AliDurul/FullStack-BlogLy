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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || null;
    const tokenKey = auth ? auth.split(' ') : null;
    if (!process.env.ACCESS_KEY)
        throw new Error('ACCESS_KEY is not defined in the environment variables');
    if (tokenKey) {
        if (tokenKey[0] == 'Bearer') {
            jsonwebtoken_1.default.verify(tokenKey[1], process.env.ACCESS_KEY, (err, userData) => {
                req.user = userData;
            });
        }
    }
    next();
});
//# sourceMappingURL=authentication.js.map