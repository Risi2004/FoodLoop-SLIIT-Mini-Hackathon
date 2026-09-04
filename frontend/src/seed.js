// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Donation = require('./src/models/Donation');
const Donor = require('./src/models/Donor');
const User = require('./src/models/User');

const sampleDonations = [
  {
    foodName: 'Bread Loaves',
    totalQuantity: 50,
    remainingQuantity: 50,
    unit: 'loaves',
    description: 'Fresh white bread, baked this morning',
    pickupAddress: 'Colombo 03, Sri Lanka',
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    foodName: 'Rice & Curry',
    totalQuantity: 30,
    remainingQuantity: 30,
    unit: 'meals',
    description: 'Vegetable rice and curry, prepared fresh',
    pickupAddress: 'Kandy, Sri Lanka',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    foodName: 'Vegetable Soup',
    totalQuantity: 20,
    remainingQuantity: 20,
    unit: 'litres',
    description: 'Healthy mixed vegetable soup',
    pickupAddress: 'Galle, Sri Lanka',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find a donor
    const donor = await Donor.findOne();
    if (!donor) {
      console.log('No donor found. Please create a donor account first.');
      process.exit(0);
    }

    // Add sample donations
    for (const donation of sampleDonations) {
      await Donation.create({
        ...donation,
        donorId: donor._id
      });
    }

    console.log('Sample donations created successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();