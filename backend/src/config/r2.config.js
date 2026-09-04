const { S3Client } = require('@aws-sdk/client-s3');

const getR2Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : null);

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    console.warn('⚠️ Cloudflare R2 credentials are not fully configured in environment variables.');
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    }
  });
};

const r2Client = getR2Client();

module.exports = {
  r2Client,
  bucketName: process.env.R2_BUCKET_NAME || 'foodloop-storage',
  publicUrl: process.env.R2_PUBLIC_URL || ''
};
