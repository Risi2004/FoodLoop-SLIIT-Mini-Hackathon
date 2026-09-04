const Donation = require('../models/Donation');
const DonationClaim = require('../models/DonationClaim');
const User = require('../models/User');
const {
  ensureDonorForUser,
  ensureReceiverForUser,
} = require('../services/roleProfile.service');

async function loadAuthUser(req) {
  if (req.user?._id && req.user.email) return req.user;
  const id = req.user?.id || req.user?._id;
  return User.findById(id);
}

// Create a new donation (donor only)
exports.createDonation = async (req, res) => {
  const { foodName, totalQuantity, description, pickupAddress, expiryDate, unit } = req.body;

  try {
    const user = await loadAuthUser(req);
    const donor = await ensureDonorForUser(user);

    const donation = new Donation({
      donorId: donor._id,
      foodName,
      totalQuantity,
      remainingQuantity: totalQuantity,
      description,
      pickupAddress,
      expiryDate,
      unit
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
};

// Get all active donations (receiver only)
exports.getActiveDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      status: 'active',
      remainingQuantity: { $gt: 0 },
      expiryDate: { $gt: new Date() }
    }).populate('donorId', 'businessName kitchenAddress contactPhone');
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Claim a donation (receiver only)
exports.claimDonation = async (req, res) => {
  const { quantity } = req.body;
  const donationId = req.params.id;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  try {
    const user = await loadAuthUser(req);
    const receiver = await ensureReceiverForUser(user);

    const updatedDonation = await Donation.findOneAndUpdate(
      {
        _id: donationId,
        remainingQuantity: { $gte: quantity },
        status: 'active'
      },
      { $inc: { remainingQuantity: -quantity } },
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(400).json({
        error: 'Not enough quantity or donation is no longer available'
      });
    }

    const claim = new DonationClaim({
      donationId: donationId,
      receiverId: receiver._id,
      claimedQuantity: quantity,
      status: 'pending'
    });
    await claim.save();

    if (updatedDonation.remainingQuantity === 0) {
      await Donation.findByIdAndUpdate(donationId, { status: 'fulfilled' });
    }

    res.json({
      donation: updatedDonation,
      claim,
      message: `Claimed ${quantity} item(s). Remaining: ${updatedDonation.remainingQuantity}`
    });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
};

// Get all donations for the logged-in donor
exports.getDonorDonations = async (req, res) => {
  try {
    const user = await loadAuthUser(req);
    const donor = await ensureDonorForUser(user);
    const donations = await Donation.find({ donorId: donor._id })
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Server error' });
  }
};
