"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("./env");
// S3Client Credentials:
const s3Client = new client_s3_1.S3Client({
    region: env_1.ENV.awsRegion,
    credentials: {
        accessKeyId: env_1.ENV.awsAccessKeyId,
        secretAccessKey: env_1.ENV.awsSecretAccessKey,
    }
});
exports.default = s3Client;
//# sourceMappingURL=aws.js.map