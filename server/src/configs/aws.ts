import { S3Client } from '@aws-sdk/client-s3';
import {ENV} from './env';

// S3Client Credentials:
const s3Client = new S3Client({
    region: ENV.awsRegion,
    credentials: {
        accessKeyId: ENV.awsAccessKeyId!,
        secretAccessKey: ENV.awsSecretAccessKey!,
    }
});

export default s3Client;