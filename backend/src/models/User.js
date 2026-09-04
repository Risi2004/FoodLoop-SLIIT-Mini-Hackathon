const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { 
  USER_ROLES, 
  DONOR_TYPES, 
  RECEIVER_TYPES, 
  VEHICLE_TYPES, 
  ACCOUNT_STATUS 
} = require('../config/constants');

// Schema for Cloudflare R2 file metadata
const FileAttachmentSchema = new mongoose.Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
  fileName: { type: String },
  mimeType: { type: String },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  // Core Identifiers & Credentials
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    required: [true, 'Role is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  profilePhoto: {
    type: FileAttachmentSchema,
    default: null
  },
  status: {
    type: String,
    enum: Object.values(ACCOUNT_STATUS),
    default: ACCOUNT_STATUS.VERIFIED
  },

  // Role: DONOR Specific Fields
  businessName: {
    type: String,
    trim: true
  },
  donorType: {
    type: String,
    enum: Object.values(DONOR_TYPES)
  },
  businessRegistrationDocument: {
    type: FileAttachmentSchema,
    default: null
  },
  addressProof: {
    type: FileAttachmentSchema,
    default: null
  },

  // Role: RECEIVER Specific Fields
  receiverName: {
    type: String,
    trim: true
  },
  receiverType: {
    type: String,
    enum: Object.values(RECEIVER_TYPES)
  },

  // Role: DRIVER Specific Fields
  driverName: {
    type: String,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: Object.values(VEHICLE_TYPES)
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  nicFrontBack: {
    type: FileAttachmentSchema,
    default: null
  },
  drivingLicenseFrontBack: {
    type: FileAttachmentSchema,
    default: null
  },

  // Password Reset Tokens
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpire;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save password hashing hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Safe display name getter
UserSchema.virtual('displayName').get(function () {
  if (this.role === USER_ROLES.DONOR) return this.businessName;
  if (this.role === USER_ROLES.RECEIVER) return this.receiverName;
  if (this.role === USER_ROLES.DRIVER) return this.driverName;
  return 'Admin';
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
