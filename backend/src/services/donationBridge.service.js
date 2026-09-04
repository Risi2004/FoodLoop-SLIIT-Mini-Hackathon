const crypto = require('crypto');
const Pickup = require('../models/Pickup');

/** Treat HTML date (YYYY-MM-DD) as end of that calendar day in Sri Lanka (+0530). */
function normalizeExpiryDate(expiryDate) {
  if (!expiryDate) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(23, 59, 59, 999);
    return fallback;
  }

  const raw = String(expiryDate).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(`${raw}T23:59:59.999+05:30`);
  }

  const parsed = new Date(expiryDate);
  if (Number.isNaN(parsed.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 1);
    fallback.setHours(23, 59, 59, 999);
    return fallback;
  }

  // If midnight UTC from a date-only parse, push to end of that day (+0530)
  if (
    parsed.getUTCHours() === 0 &&
    parsed.getUTCMinutes() === 0 &&
    parsed.getUTCSeconds() === 0
  ) {
    const y = parsed.getUTCFullYear();
    const m = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const d = String(parsed.getUTCDate()).padStart(2, '0');
    return new Date(`${y}-${m}-${d}T23:59:59.999+05:30`);
  }

  return parsed;
}

function estimateWeightKg(quantity, unit) {
  const qty = Math.max(0.1, Number(quantity) || 1);
  const u = String(unit || 'pieces').toLowerCase();
  if (u === 'kg') return qty;
  if (u === 'liters') return qty * 1;
  if (u === 'boxes') return qty * 2;
  if (u === 'portions') return qty * 0.4;
  return qty * 0.5;
}

function makeTrackingId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FL-${stamp}-${rand}`;
}

/** Rough Colombo-area point so tracking UI has coordinates. */
function defaultPickupLocation(seed = '') {
  const hash = [...String(seed)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const jitter = ((hash % 100) / 1000) - 0.05;
  return {
    lat: 6.9271 + jitter,
    lng: 79.8612 + jitter * 0.6,
  };
}

/**
 * Create (or refresh) a driver-facing Pickup when a donation is posted.
 */
async function ensurePickupForDonation({ donation, donor, recipientLabel = '' }) {
  if (!donation?._id) return null;

  const expiresAt = normalizeExpiryDate(donation.expiryDate);
  const existing = await Pickup.findOne({ donationId: donation._id });

  const payload = {
    donorName: donor?.businessName || 'FoodLoop Donor',
    itemLabel: donation.foodName,
    weightKg: estimateWeightKg(donation.remainingQuantity ?? donation.totalQuantity, donation.unit),
    locationLabel: donation.pickupAddress || 'Pickup location TBC',
    recipientLabel: recipientLabel || existing?.recipientLabel || 'Awaiting receiver claim',
    expiresAt,
    status: existing?.status === 'in_transit' || existing?.status === 'completed'
      ? existing.status
      : 'available',
  };

  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }

  const pickupLoc = defaultPickupLocation(donation.pickupAddress || donation._id);
  const dropLoc = {
    lat: pickupLoc.lat + 0.01,
    lng: pickupLoc.lng - 0.008,
  };

  return Pickup.create({
    trackingId: makeTrackingId(),
    donationId: donation._id,
    ...payload,
    distanceKm: 2.5,
    pickupLocation: pickupLoc,
    dropoffLocation: dropLoc,
    driverLocation: pickupLoc,
    etaMinutes: 20,
    journey: [
      {
        title: 'Donation listed',
        detail: `${payload.itemLabel} ready for pickup`,
        timeLabel: new Date().toLocaleString(),
        status: 'done',
        tone: 'green',
      },
      {
        title: 'Waiting for driver',
        detail: 'Available on the Delivery board',
        timeLabel: '',
        status: 'active',
        tone: 'blue',
      },
      {
        title: 'Deliver to receiver',
        detail: payload.recipientLabel,
        timeLabel: '',
        status: 'pending',
        tone: 'green',
      },
    ],
  });
}

async function attachClaimToPickup({ donation, receiver, donor }) {
  if (!donation?._id) return null;

  const pickup = await Pickup.findOne({ donationId: donation._id });
  const recipientLabel =
    receiver?.orgName || receiver?.pickupAddress || 'Community receiver';

  if (!pickup) {
    let donorDoc = donor;
    if (!donorDoc && donation.donorId) {
      const Donor = require('../models/Donor');
      donorDoc = await Donor.findById(donation.donorId);
    }
    return ensurePickupForDonation({
      donation,
      donor: donorDoc || { businessName: 'FoodLoop Donor' },
      recipientLabel,
    });
  }

  if (pickup.status === 'available') {
    pickup.recipientLabel = recipientLabel;
    pickup.journey = (pickup.journey || []).map((step) => {
      const plain = typeof step.toObject === 'function' ? step.toObject() : { ...step };
      if (plain.title === 'Deliver to receiver' || plain.status === 'pending') {
        return { ...plain, detail: `Deliver to ${recipientLabel}` };
      }
      return plain;
    });
    await pickup.save();
  }

  return pickup;
}

module.exports = {
  normalizeExpiryDate,
  ensurePickupForDonation,
  attachClaimToPickup,
};
