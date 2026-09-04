const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerUploadFields } = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../validations/auth.validation');

// Public Authentication Routes
router.post('/register', registerUploadFields, validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/check-email', authController.checkEmail);

// Protected Authentication Routes
router.get('/me', authenticate, authController.getMe);
router.get('/profile', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
