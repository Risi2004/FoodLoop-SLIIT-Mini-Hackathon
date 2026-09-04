const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  // Handle Mongoose Bad ObjectId Cast Error
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field. An account already exists.`;
    error = new ApiError(409, message);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation Error', errors);
  }

  // Handle Multer Errors (e.g. File too large)
  if (err.name === 'MulterError') {
    let message = `File upload error: ${err.message}`;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the maximum allowed limit of 10MB.';
    }
    error = new ApiError(400, message);
  }

  const response = {
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message || 'Internal Server Error',
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;
