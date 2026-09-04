const jwt = require('jsonwebtoken');

class TokenService {
  /**
   * Generate signed JWT access token
   * @param {Object} user - User document
   * @returns {String} JWT token
   */
  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'foodloop_jwt_secret_key_change_in_prod';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verify and decode a JWT token
   * @param {String} token 
   * @returns {Object} Decoded payload
   */
  verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'foodloop_jwt_secret_key_change_in_prod';
    return jwt.verify(token, secret);
  }
}

module.exports = new TokenService();
