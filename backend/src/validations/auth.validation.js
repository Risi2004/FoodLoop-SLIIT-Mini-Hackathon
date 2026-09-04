const { USER_ROLES, DONOR_TYPES, RECEIVER_TYPES, VEHICLE_TYPES } = require('../config/constants');
const ApiError = require('../utils/ApiError');

const validateRegister = (req, res, next) => {
  const { role, email, password, contactNo, address } = req.body;
  const errors = [];

  // Common Validations
  if (!role || !Object.values(USER_ROLES).includes(role)) {
    errors.push(`Invalid or missing role. Must be one of: ${Object.values(USER_ROLES).join(', ')}`);
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!contactNo || contactNo.trim().length < 5) {
    errors.push('A valid contact number is required');
  }

  if (!address || address.trim().length < 2) {
    errors.push('Address is required');
  }

  // Role-Specific Validations
  if (role === USER_ROLES.DONOR) {
    if (!req.body.businessName || req.body.businessName.trim().length < 2) {
      errors.push('Business name is required for Donors');
    }
    if (req.body.donorType && !Object.values(DONOR_TYPES).includes(req.body.donorType)) {
      errors.push(`Invalid donorType. Must be one of: ${Object.values(DONOR_TYPES).join(', ')}`);
    }
  } else if (role === USER_ROLES.RECEIVER) {
    if (!req.body.receiverName || req.body.receiverName.trim().length < 2) {
      errors.push('Receiver / NGO name is required');
    }
    if (req.body.receiverType && !Object.values(RECEIVER_TYPES).includes(req.body.receiverType)) {
      errors.push(`Invalid receiverType. Must be one of: ${Object.values(RECEIVER_TYPES).join(', ')}`);
    }
  } else if (role === USER_ROLES.DRIVER) {
    if (!req.body.driverName || req.body.driverName.trim().length < 2) {
      errors.push('Driver name is required');
    }
    if (req.body.vehicleType && !Object.values(VEHICLE_TYPES).includes(req.body.vehicleType)) {
      errors.push(`Invalid vehicleType. Must be one of: ${Object.values(VEHICLE_TYPES).join(', ')}`);
    }
    if (!req.body.vehicleNumber || req.body.vehicleNumber.trim().length < 2) {
      errors.push('Vehicle number is required');
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push('Email or username is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};
