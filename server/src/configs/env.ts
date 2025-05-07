import 'dotenv/config';

import { z } from 'zod'
import { CustomError } from '../utils/common';

const envSchema = z.object({
    PORT: z.string().regex(/^\d+$/),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    SECRET_KEY: z.string().min(1),
    // mongo
    MONGODB_URI: z.string().url(),
    // jwt
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1),
    // nodemailer
    EMAIL_PASS: z.string().min(1),
    EMAIL_USER: z.string().email(),
    // apis
    FRONTEND_URL: z.string().url(), 
    BACKEND_URL: z.string().url(), 
    // aws
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_BUCKET_NAME: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(parsed.error.flatten().fieldErrors);
    throw new CustomError('❌ Invalid environment variables');
}

export const ENV = {
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
    backendUrl: parsed.data.BACKEND_URL,
    awsRegion: parsed.data.AWS_REGION,
    awsAccessKeyId: parsed.data.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: parsed.data.AWS_SECRET_ACCESS_KEY,
    awsBucketName: parsed.data.AWS_BUCKET_NAME,
};