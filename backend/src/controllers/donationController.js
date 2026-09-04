const Donation = require('../models/Donation');
const DonationClaim = require('../models/DonationClaim');
const Donor = require('../models/Donor');
const Receiver = require('../models/Receiver');

// Create a new donation (donor only)
exports.createDonation = async (req, res) => {
  const { foodName, totalQuantity, description, pickupAddress, expiryDate, unit } = req.body;

  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(403).json({ error: 'Donor profile not found' });
    }

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
    res.status(500).json({ error: 'Server error' });
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
    const receiver = await Receiver.findOne({ userId: req.user.id });
    if (!receiver) {
      return res.status(403).json({ error: 'Receiver profile not found' });
    }

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
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all donations for the logged-in donor
exports.getDonorDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(403).json({ error: 'Donor profile not found' });
    }
    const donations = await Donation.find({ donorId: donor._id })
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update donation (donor only)
exports.updateDonation = async (req, res) => {
  const donationId = req.params.id;
  const { foodName, description, pickupAddress, expiryDate, unit } = req.body;

  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor || donation.donorId.toString() !== donor._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to update this donation' });
    }

    if (foodName) donation.foodName = foodName;
    if (description) donation.description = description;
    if (pickupAddress) donation.pickupAddress = pickupAddress;
    if (expiryDate) donation.expiryDate = expiryDate;
    if (unit) donation.unit = unit;

    await donation.save();
    res.json({ message: 'Donation updated successfully', donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete donation (donor only)
exports.deleteDonation = async (req, res) => {
  const donationId = req.params.id;

  try {
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor || donation.donorId.toString() !== donor._id.toString()) {
      return res.status(403).json({ error: 'You are not authorized to delete this donation' });
    }

    await DonationClaim.deleteMany({ donationId: donation._id });
    await donation.deleteOne();

    res.json({ message: 'Donation and all associated claims deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};