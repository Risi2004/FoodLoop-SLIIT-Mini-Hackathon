const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const donorRoutes = require('./donorRoutes');
const receiverRoutes = require('./receiverRoutes');
const donationRoutes = require('./donationRoutes');
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

// Mount Routes
router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/receivers', receiverRoutes);
router.use('/donations', donationRoutes);

// Driver management Routes
router.use('/pickups', pickupRoutes);
router.use('/drivers', driverRoutes);

module.exports = router;
