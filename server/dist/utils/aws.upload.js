"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
const aws_1 = __importDefault(require("../configs/aws"));
const env_1 = require("../configs/env");
const common_1 = require("./common");
const generateUploadUrl = async () => {
    const timestamp = Date.now();
    const uniqueId = (0, crypto_1.randomUUID)().slice(0, 8);
    const fileName = `${uniqueId}-${timestamp}.jpg`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: env_1.ENV.awsBucketName || 'fullstack-blogly', // Use env var if available
        Key: fileName,
        ContentType: 'image/jpeg',
    });
    const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(aws_1.default, command, { expiresIn: 1000 });
    if (!signedUrl) {
        throw new common_1.CustomError('Error while generating signed URL', 500, true);
    }
    return signedUrl;
};
exports.generateUploadUrl = generateUploadUrl;
//# sourceMappingURL=aws.upload.js.map