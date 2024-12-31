'use strict';

const { S3Client } = require('@aws-sdk/client-s3');

// S3Client Credentials:
module.exports = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
})

// async function main() {



//     // Create an Amazon S3 bucket. The epoch timestamp is appended
//     const bucketName = `test-bucket-${Date.now()}`;
//     await s3Client.send(
//         new CreateBucketCommand({
//             Bucket: bucketName,
//         })
//     );

//     // Put an object into an Amazon S3 bucket.
//     await s3Client.send(
//         new PutObjectCommand({
//             Bucket: bucketName,
//             Key: 'my-first-object.txt',
//             Body: 'Hello JavaScript SDK!',
//         })
//     );

//     // Read the object.
//     const { Body } = await s3Client.send(
//         new GetObjectCommand({
//             Bucket: bucketName,
//             Key: 'my-first-object.txt',
//         })
//     );

//     console.log(await Body.transformToString());

//     // Confirm resource deletion.
//     const prompt = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     prompt.question('Empty and delete bucket? (y/n) ', async (result) => {
//         prompt.close();

//         if (result === 'y') {
//             // Create an async iterator over lists of objects in a bucket.
//             const paginator = paginateListObjectsV2(
//                 { client: s3Client },
//                 { Bucket: bucketName }
//             );
//             for await (const page of paginator) {
//                 const objects = page.Contents;
//                 if (objects) {
//                     for (const object of objects) {
//                         await s3Client.send(
//                             new DeleteObjectCommand({ Bucket: bucketName, Key: object.Key })
//                         );
//                     }
//                 }
//             }
//             // Once all the objects are gone, the bucket can be deleted.

//             await s3Client.send(new DeleteBucketCommand({ Bucket: bucketName }));
//         }
//     });


// }

// if (require.main === module) {
//     main();
// }