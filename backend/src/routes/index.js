const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');

// Healthcheck Route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Authentication Routes Mount
router.use('/auth', authRoutes);

module.exports = router;
