const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

class AuthController {
  /**
   * @desc   Register a new user (Donor, Receiver, Driver, Admin) with Cloudflare R2 file uploads
   * @route  POST /api/auth/register
   * @access Public
   */
  register = asyncHandler(async (req, res) => {
    const { user, token } = await authService.register(req.body, req.files);
    
    res.status(201).json(
      new ApiResponse(201, { user, token }, 'Registration successful! Welcome to FoodLoop.')
    );
  });

  /**
   * @desc   Login user with email/username and password
   * @route  POST /api/auth/login
   * @access Public
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json(
      new ApiResponse(200, { user, token }, 'Login successful!')
    );
  });

  /**
   * @desc   Get authenticated user profile
   * @route  GET /api/auth/me
   * @access Private (Authenticated)
   */
  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);

    res.status(200).json(
      new ApiResponse(200, { user }, 'Profile retrieved successfully.')
    );
  });

  /**
   * @desc   Logout user (clear cookie / token acknowledgment)
   * @route  POST /api/auth/logout
   * @access Private
   */
  logout = asyncHandler(async (req, res) => {
    res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully.')
    );
  });

  /**
   * @desc   Initiate password reset request
   * @route  POST /api/auth/forgot-password
   * @access Public
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.status(200).json(
      new ApiResponse(200, result, result.message)
    );
  });

  /**
   * @desc   Reset password using reset token
   * @route  POST /api/auth/reset-password/:token
   * @access Public
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const result = await authService.resetPassword(token, password);

    res.status(200).json(
      new ApiResponse(200, result, 'Password reset successful! You are now logged in.')
    );
  });

  /**
   * @desc   Check if email is already registered (Live validator)
   * @route  POST /api/auth/check-email
   * @access Public
   */
  checkEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(200).json(new ApiResponse(200, { isAvailable: false }));
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    res.status(200).json(
      new ApiResponse(200, { isAvailable: !existing }, !existing ? 'Email is available.' : 'Email is already in use.')
    );
  });
}

module.exports = new AuthController();
