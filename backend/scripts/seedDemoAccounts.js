/**
 * Seed demo donor + receiver accounts and lots of donation/claim data.
 * Usage: node scripts/seedDemoAccounts.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Donor = require('../src/models/Donor');
const Receiver = require('../src/models/Receiver');
const Donation = require('../src/models/Donation');
const DonationClaim = require('../src/models/DonationClaim');
const Driver = require('../src/models/Driver');
const Pickup = require('../src/models/Pickup');
const { USER_ROLES, DONOR_TYPES, RECEIVER_TYPES } = require('../src/config/constants');

const DEMO = {
  donor: {
    email: 'demo.donor@foodloop.com',
    password: 'demo1234',
    contactNo: '0771112233',
    address: '42 Galle Road, Colombo 03',
    businessName: 'Fresh Bakes Bakery',
    donorType: DONOR_TYPES.BAKERY,
  },
  receiver: {
    email: 'demo.receiver@foodloop.com',
    password: 'demo1234',
    contactNo: '0774445566',
    address: '12 Temple Road, Gampaha',
    receiverName: 'Hope Community Kitchen',
    receiverType: RECEIVER_TYPES.COMMUNITY_KITCHEN,
  },
};

const FOOD_ITEMS = [
  ['Assorted Pastries', 'pieces', 40, 'Bakery leftovers — still fresh'],
  ['Vegetable Curry Packs', 'plates', 25, 'Cooked lunch surplus'],
  ['Steamed Rice Containers', 'boxes', 30, 'Hot rice, packed for pickup'],
  ['Fresh Bread Loaves', 'loaves', 18, 'Day-old bread, sealed'],
  ['Fruit Mix Trays', 'kg', 12, 'Seasonal cut fruit'],
  ['Sandwich Platters', 'platters', 8, 'Event surplus sandwiches'],
  ['Milk Cartons', 'liters', 20, 'Chilled dairy, 2 days to expiry'],
  ['Salad Bowls', 'bowls', 15, 'Cold storage salads'],
  ['Chicken Biryani Packs', 'plates', 22, 'Wedding hall surplus'],
  ['Vegan Wrap Boxes', 'boxes', 16, 'Cafe closing stock'],
  ['Soup Containers', 'liters', 10, 'Tomato & lentil soup'],
  ['Cookie Assortment', 'kg', 6, 'Bakery end-of-day cookies'],
  ['Yogurt Cups', 'cups', 48, 'Unopened refrigerated cups'],
  ['Pasta Trays', 'trays', 14, 'Catered event leftovers'],
  ['Juice Bottles', 'bottles', 36, 'Sealed orange juice'],
  ['Egg Curry Packs', 'plates', 20, 'Hotel kitchen surplus'],
  ['Roti & Curry Sets', 'sets', 28, 'Dinner buffet leftovers'],
  ['Fresh Vegetables', 'kg', 35, 'Market end-of-day produce'],
  ['Banana Bunches', 'kg', 22, 'Slightly ripe, perfect for kitchens'],
  ['Cake Slices', 'pieces', 50, 'Celebration leftover cake'],
];

const ADDRESSES = [
  'Fresh Bakes Bakery, Gampaha Town',
  'Green Leaf Cafe, Colombo 07',
  'Ocean View Hotel Kitchen, Negombo',
  'City Supermarket Back Dock, Kiribathgoda',
  'Sunrise Wedding Hall, Kadawatha',
  'Lotus Caterers, Ja-Ela',
  'Metro Bakery, Nugegoda',
  'Campus Canteen, Kelaniya',
];

async function upsertUser(spec, role) {
  let user = await User.findOne({ email: spec.email });
  if (user) {
    console.log(`User exists: ${spec.email}`);
    return user;
  }

  const payload = {
    role,
    email: spec.email,
    password: spec.password,
    contactNo: spec.contactNo,
    address: spec.address,
  };

  if (role === USER_ROLES.DONOR) {
    payload.businessName = spec.businessName;
    payload.donorType = spec.donorType;
  } else if (role === USER_ROLES.RECEIVER) {
    payload.receiverName = spec.receiverName;
    payload.receiverType = spec.receiverType;
  }

  user = await User.create(payload);
  console.log(`Created user: ${spec.email} (${role})`);
  return user;
}

async function upsertDonorProfile(user, spec) {
  let donor = await Donor.findOne({ userId: user._id });
  if (donor) return donor;

  donor = await Donor.create({
    userId: user._id,
    businessName: spec.businessName,
    businessType: 'restaurant',
    fssaiLicense: 'FSSAI-DEMO-1001',
    kitchenAddress: spec.address,
    contactPhone: spec.contactNo,
    isVerifiedByAdmin: true,
  });
  console.log(`Created Donor profile: ${donor.businessName}`);
  return donor;
}

async function upsertReceiverProfile(user, spec) {
  let receiver = await Receiver.findOne({ userId: user._id });
  if (receiver) return receiver;

  receiver = await Receiver.create({
    userId: user._id,
    orgName: spec.receiverName,
    orgType: 'soup_kitchen',
    registrationNumber: 'NGO-DEMO-2002',
    pickupAddress: spec.address,
    contactPhone: spec.contactNo,
    isVerifiedByAdmin: true,
  });
  console.log(`Created Receiver profile: ${receiver.orgName}`);
  return receiver;
}

async function seedDonations(donor, receiver) {
  const existing = await Donation.countDocuments({ donorId: donor._id });
  if (existing >= 20) {
    console.log(`Donor already has ${existing} donations — skipping donation seed`);
    return Donation.find({ donorId: donor._id });
  }

  // Clear partial demo set for this donor to reseed cleanly
  const oldIds = (await Donation.find({ donorId: donor._id }).select('_id')).map((d) => d._id);
  if (oldIds.length) {
    await DonationClaim.deleteMany({ donationId: { $in: oldIds } });
    await Donation.deleteMany({ _id: { $in: oldIds } });
  }

  const now = Date.now();
  const docs = FOOD_ITEMS.map(([foodName, unit, qty, description], i) => {
    const claimed = i % 4 === 0 ? Math.floor(qty * 0.4) : i % 5 === 0 ? qty : 0;
    const remaining = Math.max(0, qty - claimed);
    let status = 'active';
    if (remaining === 0) status = 'fulfilled';
    if (i === FOOD_ITEMS.length - 1) status = 'expired';

    return {
      donorId: donor._id,
      foodName,
      description,
      totalQuantity: qty,
      remainingQuantity: status === 'expired' ? qty : remaining,
      unit,
      pickupAddress: ADDRESSES[i % ADDRESSES.length],
      expiryDate: new Date(now + (status === 'expired' ? -2 : 1 + (i % 5)) * 24 * 60 * 60 * 1000),
      status: status === 'expired' ? 'expired' : remaining === 0 ? 'fulfilled' : 'active',
      createdAt: new Date(now - i * 3 * 60 * 60 * 1000),
    };
  });

  const created = await Donation.insertMany(docs);
  console.log(`Created ${created.length} donations`);

  // Claims on a subset
  const claimable = created.filter((d) => d.status === 'fulfilled' || d.remainingQuantity < d.totalQuantity);
  const claims = [];
  for (const donation of claimable.slice(0, 10)) {
    const qty = Math.max(1, donation.totalQuantity - donation.remainingQuantity);
    claims.push({
      donationId: donation._id,
      receiverId: receiver._id,
      claimedQuantity: qty || Math.ceil(donation.totalQuantity / 3),
      status: ['pending', 'approved', 'picked_up', 'delivered'][claims.length % 4],
      claimedAt: new Date(now - claims.length * 5 * 60 * 60 * 1000),
    });
  }
  if (claims.length) {
    await DonationClaim.insertMany(claims);
    console.log(`Created ${claims.length} claims`);
  }

  return created;
}

async function seedExtraPickups() {
  const driver = await Driver.findOne({ email: 'demo.driver@foodloop.com' });
  if (!driver) {
    console.log('No demo driver found — skipping extra pickups');
    return;
  }

  const count = await Pickup.countDocuments();
  if (count >= 12) {
    console.log(`Already have ${count} pickups — skipping`);
    return;
  }

  const extras = [];
  for (let i = 3; i <= 12; i++) {
    const trackingId = `FL-DEMO-${String(i).padStart(3, '0')}`;
    const exists = await Pickup.findOne({ trackingId });
    if (exists) continue;
    const item = FOOD_ITEMS[(i - 1) % FOOD_ITEMS.length];
    extras.push({
      trackingId,
      donorName: ADDRESSES[(i - 1) % ADDRESSES.length].split(',')[0],
      itemLabel: item[0],
      weightKg: 2 + (i % 8),
      distanceKm: Number((0.4 + i * 0.15).toFixed(1)),
      locationLabel: 'Gampaha',
      recipientLabel: 'Hope Community Kitchen',
      pickupLocation: { lat: 7.08 + i * 0.002, lng: 80.0 + i * 0.002 },
      dropoffLocation: { lat: 7.07, lng: 80.02 },
      driverLocation: { lat: 7.084, lng: 80.01 },
      expiresAt: new Date(Date.now() + (10 + i * 5) * 60 * 1000),
      status: i % 5 === 0 ? 'completed' : i % 4 === 0 ? 'in_transit' : 'available',
      driver: i % 4 === 0 || i % 5 === 0 ? driver._id : null,
      etaMinutes: 10 + i,
    });
  }

  if (extras.length) {
    await Pickup.insertMany(extras);
    console.log(`Created ${extras.length} extra pickups`);
  }
}

async function main() {
  await connectDB();

  const donorUser = await upsertUser(DEMO.donor, USER_ROLES.DONOR);
  const receiverUser = await upsertUser(DEMO.receiver, USER_ROLES.RECEIVER);
  const donor = await upsertDonorProfile(donorUser, DEMO.donor);
  const receiver = await upsertReceiverProfile(receiverUser, DEMO.receiver);

  await seedDonations(donor, receiver);
  await seedExtraPickups();

  const active = await Donation.countDocuments({ status: 'active', remainingQuantity: { $gt: 0 } });
  const claims = await DonationClaim.countDocuments({ receiverId: receiver._id });
  const pickups = await Pickup.countDocuments();

  console.log('\n=== DEMO CREDENTIALS ===');
  console.log('DONOR');
  console.log('  email:    demo.donor@foodloop.com');
  console.log('  password: demo1234');
  console.log('  business: Fresh Bakes Bakery');
  console.log('RECEIVER');
  console.log('  email:    demo.receiver@foodloop.com');
  console.log('  password: demo1234');
  console.log('  org:      Hope Community Kitchen');
  console.log('DRIVER (existing)');
  console.log('  email:    demo.driver@foodloop.com');
  console.log('  password: demo1234');
  console.log(`\nData: ${active} active donations, ${claims} claims, ${pickups} pickups`);

  await mongoose.connection.close();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
