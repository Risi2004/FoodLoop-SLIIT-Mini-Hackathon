const mongoose = require('mongoose');

const DonationClaimSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receiver', required: true },
  claimedQuantity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'picked_up', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  claimedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DonationClaim', DonationClaimSchema);