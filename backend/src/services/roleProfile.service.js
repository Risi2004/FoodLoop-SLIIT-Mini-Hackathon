const Donor = require('../models/Donor');
const Receiver = require('../models/Receiver');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../config/constants');

function mapBusinessType(donorType) {
  const value = String(donorType || '').toLowerCase();
  if (value.includes('hotel')) return 'hotel';
  if (value.includes('cater')) return 'caterer';
  if (value.includes('restaurant') || value.includes('bakery') || value.includes('cafe')) {
    return 'restaurant';
  }
  return 'other';
}

function mapOrgType(receiverType) {
  const value = String(receiverType || '').toLowerCase();
  if (value.includes('ngo')) return 'ngo';
  if (value.includes('kitchen') || value.includes('soup')) return 'soup_kitchen';
  if (value.includes('religious') || value.includes('temple') || value.includes('church')) {
    return 'religious';
  }
  if (value.includes('community') || value.includes('shelter') || value.includes('orphan')) {
    return 'community_center';
  }
  return 'other';
}

/**
 * Donation APIs use a separate Donor collection. Auth signup only creates User —
 * bridge them so deployed donors don't hit "Donor profile not found".
 */
async function ensureDonorForUser(user) {
  if (!user?._id) {
    throw new ApiError(401, 'Authentication required');
  }

  const role = String(user.role || '').toUpperCase();
  if (role !== USER_ROLES.DONOR) {
    throw new ApiError(403, 'Only donor accounts can access donor profiles');
  }

  let donor = await Donor.findOne({ userId: user._id });
  if (donor) return donor;

  donor = await Donor.create({
    userId: user._id,
    businessName: user.businessName || user.email?.split('@')[0] || 'Donor',
    businessType: mapBusinessType(user.donorType),
    fssaiLicense: 'PENDING',
    kitchenAddress: user.address || '',
    contactPhone: user.contactNo || '',
    isVerifiedByAdmin: true,
  });

  return donor;
}

async function ensureReceiverForUser(user) {
  if (!user?._id) {
    throw new ApiError(401, 'Authentication required');
  }

  const role = String(user.role || '').toUpperCase();
  if (role !== USER_ROLES.RECEIVER) {
    throw new ApiError(403, 'Only receiver accounts can access receiver profiles');
  }

  let receiver = await Receiver.findOne({ userId: user._id });
  if (receiver) return receiver;

  receiver = await Receiver.create({
    userId: user._id,
    orgName: user.receiverName || user.email?.split('@')[0] || 'Receiver',
    orgType: mapOrgType(user.receiverType),
    registrationNumber: '',
    pickupAddress: user.address || '',
    contactPhone: user.contactNo || '',
    isVerifiedByAdmin: true,
  });

  return receiver;
}

module.exports = {
  ensureDonorForUser,
  ensureReceiverForUser,
};
