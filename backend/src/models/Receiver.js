const mongoose = require('mongoose');

const ReceiverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgName: { type: String, required: true },
  orgType: { type: String, enum: ['ngo', 'soup_kitchen', 'religious', 'community_center', 'other'] },
  registrationNumber: String,
  pickupAddress: String,
  contactPhone: String,
  isVerifiedByAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receiver', ReceiverSchema);