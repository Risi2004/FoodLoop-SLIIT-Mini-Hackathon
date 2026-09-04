const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, enum: ['hotel', 'restaurant', 'caterer', 'other'] },
  fssaiLicense: { type: String, required: true },
  kitchenAddress: String,
  contactPhone: String,
  isVerifiedByAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donor', DonorSchema);