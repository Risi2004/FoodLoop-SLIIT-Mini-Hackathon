const User = require('../models/User');
const Donor = require('../models/Donor');
const Receiver = require('../models/Receiver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to create token
const createToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register a new user (donor or receiver)
exports.register = async (req, res) => {
  const { email, password, role, businessName, orgName, ...extra } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (without profileId yet)
    user = new User({
      email,
      password: hashedPassword,
      role
    });
    await user.save();

    // Create role-specific profile
    let profile;
    if (role === 'donor') {
      profile = new Donor({
        userId: user._id,
        businessName,
        fssaiLicense: extra.fssaiLicense,
        businessType: extra.businessType,
        kitchenAddress: extra.kitchenAddress,
        contactPhone: extra.contactPhone
      });
    } else if (role === 'receiver') {
      profile = new Receiver({
        userId: user._id,
        orgName,
        orgType: extra.orgType,
        registrationNumber: extra.registrationNumber,
        pickupAddress: extra.pickupAddress,
        contactPhone: extra.contactPhone
      });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
    await profile.save();

    // Update user with profileId
    user.profileId = profile._id;
    await user.save();

    // Generate token
    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.json({ token, user: { id: user._id, email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};