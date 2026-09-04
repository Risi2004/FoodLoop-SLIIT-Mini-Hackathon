const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { r2Client, bucketName, publicUrl } = require('../config/r2.config');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const path = require('path');

class R2Service {
  /**
   * Upload a single file buffer to Cloudflare R2
   * @param {Object} file - Express multer file object
   * @param {String} folder - Destination folder inside R2 bucket (e.g., 'profile-photos', 'documents')
   * @returns {Promise<Object>} { key, url, fileName, mimeType, size }
   */
  async uploadFile(file, folder = 'general') {
    if (!file || !file.buffer) {
      return null;
    }

    // Generate unique sanitized filename
    const fileExt = path.extname(file.originalname) || '';
    const uniqueId = crypto.randomBytes(12).toString('hex');
    const timestamp = Date.now();
    const sanitizedOriginalName = path.basename(file.originalname, fileExt)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    
    const key = `${folder}/${timestamp}-${uniqueId}-${sanitizedOriginalName}${fileExt}`;

    if (!r2Client) {
      console.warn(`[R2Service] R2 Client not configured. Simulating upload for key: ${key}`);
      return {
        key: key,
        url: publicUrl ? `${publicUrl.replace(/\/$/, '')}/${key}` : `https://r2.foodloop.local/${key}`,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        isMock: true
      };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      });

      await r2Client.send(command);

      const fileUrl = publicUrl 
        ? `${publicUrl.replace(/\/$/, '')}/${key}` 
        : `https://${bucketName}.r2.cloudflarestorage.com/${key}`;

      return {
        key: key,
        url: fileUrl,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      };
    } catch (error) {
      console.error(`[R2Service] Upload Error for ${key}:`, error);
      throw new ApiError(500, `Failed to upload file to Cloudflare R2: ${error.message}`);
    }
  }

  /**
   * Delete a file from Cloudflare R2 by its object key
   * @param {String} key - Object key in bucket
   */
  async deleteFile(key) {
    if (!key || !r2Client) return;

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key
      });
      await r2Client.send(command);
    } catch (error) {
      console.error(`[R2Service] Delete Error for key ${key}:`, error);
    }
  }
}

module.exports = new R2Service();
