const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const pickupRoutes = require('./pickup.routes');
const driverRoutes = require('./driver.routes');

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

// Driver management Routes
router.use('/pickups', pickupRoutes);
router.use('/drivers', driverRoutes);

module.exports = router;
