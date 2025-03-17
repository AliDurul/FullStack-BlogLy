const { nanoid } = require('nanoid');
import s3Client from '../configs/awsConnection';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CustomError } from './utils';


export const generateUploadUrl = async (): Promise<string | Error> => {
    const data = new Date();
    const imageName = `${nanoid(5)}-${data.getTime()}.jpg`;

    const command = new PutObjectCommand({
        Bucket: 'fullstack-blogly',
        Key: imageName,
        ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 1000 });

    if (!signedUrl) throw new CustomError('Error while generating signed URL', 500);
    

    return signedUrl;
};

