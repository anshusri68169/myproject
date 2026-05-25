import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFile = async (file, folder = 'documents') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileKey = `${folder}/${uuidv4()}-${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private',
    };

    const result = await s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

export const deleteFile = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

export const getSignedUrl = (fileKey, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Expires: expiresIn,
    };

    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};
