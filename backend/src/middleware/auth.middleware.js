const tokenService = require('../services/token.service');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect routes by verifying JWT in Authorization header
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. No access token provided.');
  }

  try {
    const decoded = tokenService.verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'Your account has been suspended.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid authentication token.');
    } else if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Authentication token has expired. Please login again.');
    }
    throw error;
  }
});

/**
 * Restrict routes to specific user roles
 * @param  {...String} roles - Allowed roles (e.g. 'ADMIN', 'DONOR')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Role '${req.user.role}' is not authorized to access this resource.`));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
