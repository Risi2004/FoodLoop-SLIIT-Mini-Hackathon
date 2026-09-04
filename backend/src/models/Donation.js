const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  foodName: { type: String, required: true },
  description: String,
  totalQuantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  unit: { type: String, default: 'pieces' },
  pickupAddress: { type: String, required: true },
  expiryDate: Date,
  status: { 
    type: String, 
    enum: ['active', 'fulfilled', 'expired'], 
    default: 'active' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);