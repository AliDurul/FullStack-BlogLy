'use strict';

const { nanoid } = require('nanoid');
const s3Client = require('../configs/awsConnection');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// generateUploadUrl helper function:
module.exports = async () => {

    const data = new Date()
    const imageName = `${nanoid(5)}-${data.getTime()}.jpg`

    const command = new PutObjectCommand({
        Bucket: 'fullstack-blogly',
        Key: imageName,
        ContentType: 'image/jpeg',
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 1000 },);

    return signedUrl;
}