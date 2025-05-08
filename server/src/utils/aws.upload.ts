import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import s3Client from '../configs/aws';
import { ENV } from '../configs/env';
import { CustomError } from './common';

export const generateUploadUrl = async (): Promise<string> => {
    const timestamp = Date.now();
    const uniqueId = randomUUID().slice(0, 8);
    const fileName = `${uniqueId}-${timestamp}.jpg`;

    const command = new PutObjectCommand({
        Bucket: ENV.awsBucketName || 'fullstack-blogly', // Use env var if available
        Key: fileName,
        ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 1000 });

    if (!signedUrl) {
        throw new CustomError('Error while generating signed URL', 500, true);
    }

    return signedUrl;

};