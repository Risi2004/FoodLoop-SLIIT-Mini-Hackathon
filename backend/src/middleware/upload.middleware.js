const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Memory storage keeps file buffer in RAM for direct Cloudflare R2 streaming
const storage = multer.memoryStorage();

// Allowed file MIME types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
    'image/heic'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, PDF.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per document
  },
  fileFilter: fileFilter
});

// Multipart fields for role-based registrations
const registerUploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'businessRegistrationDocument', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'nicFrontBack', maxCount: 2 },
  { name: 'drivingLicenseFrontBack', maxCount: 2 }
]);

module.exports = {
  upload,
  registerUploadFields
};
