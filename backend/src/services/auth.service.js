const User = require('../models/User');
const r2Service = require('./r2.service');
const tokenService = require('./token.service');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const { USER_ROLES } = require('../config/constants');
const driverService = require('./driver.service');

class AuthService {
  /**
   * Register a new user with role-specific data & Cloudflare R2 file attachments
   */
  async register(userData, files = {}) {
    const { email } = userData;

    // 1. Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists.');
    }

    // 2. Upload files to Cloudflare R2
    let profilePhotoData = null;
    let businessRegData = null;
    let addressProofData = null;
    let nicData = null;
    let licenseData = null;

    if (files.profilePhoto && files.profilePhoto[0]) {
      profilePhotoData = await r2Service.uploadFile(files.profilePhoto[0], 'profile-photos');
    }

    if (files.businessRegistrationDocument && files.businessRegistrationDocument[0]) {
      businessRegData = await r2Service.uploadFile(files.businessRegistrationDocument[0], 'business-registrations');
    }

    if (files.addressProof && files.addressProof[0]) {
      addressProofData = await r2Service.uploadFile(files.addressProof[0], 'address-proofs');
    }

    if (files.nicFrontBack && files.nicFrontBack[0]) {
      nicData = await r2Service.uploadFile(files.nicFrontBack[0], 'nic-documents');
    }

    if (files.drivingLicenseFrontBack && files.drivingLicenseFrontBack[0]) {
      licenseData = await r2Service.uploadFile(files.drivingLicenseFrontBack[0], 'driving-licenses');
    }

    // 3. Construct user document
    const newUserObj = {
      role: userData.role,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      contactNo: userData.contactNo.trim(),
      address: userData.address.trim(),
      profilePhoto: profilePhotoData
    };

    // Attach role-specific properties
    if (userData.role === USER_ROLES.DONOR) {
      newUserObj.businessName = userData.businessName;
      newUserObj.donorType = userData.donorType;
      newUserObj.businessRegistrationDocument = businessRegData;
      newUserObj.addressProof = addressProofData;
    } else if (userData.role === USER_ROLES.RECEIVER) {
      newUserObj.receiverName = userData.receiverName;
      newUserObj.receiverType = userData.receiverType;
      newUserObj.businessRegistrationDocument = businessRegData;
      newUserObj.addressProof = addressProofData;
    } else if (userData.role === USER_ROLES.DRIVER) {
      newUserObj.driverName = userData.driverName;
      newUserObj.vehicleType = userData.vehicleType || 'scooter';
      newUserObj.vehicleNumber = userData.vehicleNumber;
      newUserObj.nicFrontBack = nicData;
      newUserObj.drivingLicenseFrontBack = licenseData;
    }

    // 4. Save user
    const createdUser = await User.create(newUserObj);

    // 4b. Create logistics Driver profile for pickup flows
    if (userData.role === USER_ROLES.DRIVER) {
      await driverService.ensureDriverForUser(createdUser);
    }

    // 5. Generate Auth Token
    const token = tokenService.generateToken(createdUser);

    return {
      user: createdUser,
      token
    };
  }

  /**
   * Authenticate user by email & password
   */
  async login(emailOrUsername, password) {
    const user = await User.findOne({ email: emailOrUsername.toLowerCase().trim() }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid credentials. Please check your email and password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials. Please check your email and password.');
    }

    if (user.status === 'SUSPENDED') {
      throw new ApiError(403, 'Your account has been suspended. Please contact FoodLoop support.');
    }

    const token = tokenService.generateToken(user);

    // Ensure logistics profile exists for registered drivers
    if (String(user.role).toUpperCase() === USER_ROLES.DRIVER) {
      await driverService.ensureDriverForUser(user);
    }

    // Remove password from returned object
    const userJson = user.toJSON();

    return {
      user: userJson,
      token
    };
  }

  /**
   * Retrieve user profile by user ID
   */
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User profile not found.');
    }
    return user;
  }

  /**
   * Request password reset token
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return success even if not found to prevent user enumeration
      return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save({ validateBeforeSave: false });

    return {
      message: 'Password reset instructions generated successfully.',
      resetToken // In production, this would be sent via Email service
    };
  }

  /**
   * Reset user password using token
   */
  async resetPassword(resetToken, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(400, 'Password reset token is invalid or has expired.');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = tokenService.generateToken(user);
    return {
      user: user.toJSON(),
      token
    };
  }
}

module.exports = new AuthService();
