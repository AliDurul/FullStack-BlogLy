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
exports.generateUploadUrl = void 0;
const { nanoid } = require('nanoid');
const awsConnection_1 = __importDefault(require("../configs/awsConnection"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const utils_1 = require("./utils");
const generateUploadUrl = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = new Date();
    const imageName = `${nanoid(5)}-${data.getTime()}.jpg`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: 'fullstack-blogly',
        Key: imageName,
        ContentType: 'image/jpeg',
    });
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(awsConnection_1.default, command, { expiresIn: 1000 });
    if (!signedUrl)
        throw new utils_1.CustomError('Error while generating signed URL', 500);
    return signedUrl;
});
exports.generateUploadUrl = generateUploadUrl;
//# sourceMappingURL=awsUpload.js.map