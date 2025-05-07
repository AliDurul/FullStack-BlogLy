"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const common_1 = require("../utils/common");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().regex(/^\d+$/),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    SECRET_KEY: zod_1.z.string().min(1),
    // mongo
    MONGODB_URI: zod_1.z.string().url(),
    // jwt
    JWT_SECRET: zod_1.z.string().min(1),
    JWT_EXPIRES_IN: zod_1.z.string().min(1),
    JWT_REFRESH_SECRET: zod_1.z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().min(1),
    // nodemailer
    EMAIL_PASS: zod_1.z.string().min(1),
    EMAIL_USER: zod_1.z.string().email(),
    // frontend
    FRONTEND_URL: zod_1.z.string().url(),
    // aws
    AWS_REGION: zod_1.z.string().min(1),
    AWS_ACCESS_KEY_ID: zod_1.z.string().min(1),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().min(1),
    AWS_BUCKET_NAME: zod_1.z.string().min(1),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    throw new common_1.CustomError('❌ Invalid environment variables');
}
exports.ENV = {
    port: Number(parsed.data.PORT),
    nodeEnv: parsed.data.NODE_ENV,
    secretKey: parsed.data.SECRET_KEY,
    mongoDbUri: parsed.data.MONGODB_URI,
    jwtSecret: parsed.data.JWT_SECRET,
    jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
    jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
    emailPass: parsed.data.EMAIL_PASS,
    emailUser: parsed.data.EMAIL_USER,
    frontendUrl: parsed.data.FRONTEND_URL,
    awsRegion: parsed.data.AWS_REGION,
    awsAccessKeyId: parsed.data.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: parsed.data.AWS_SECRET_ACCESS_KEY,
    awsBucketName: parsed.data.AWS_BUCKET_NAME,
};
//# sourceMappingURL=env.js.map