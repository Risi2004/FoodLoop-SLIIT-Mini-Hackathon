/**
 * Seed lots of dummy pickups for the demo driver.
 * Usage: node scripts/seedLotsOfPickups.js
 * Keeps demo.driver@foodloop.com; replaces all Pickup documents.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Driver = require("../src/models/Driver");
const Pickup = require("../src/models/Pickup");

const DONORS = [
  "Fresh Bakes Bakery",
  "Green Leaf Cafe",
  "City Mart",
  "Ocean View Hotel",
  "Lotus Caterers",
  "Metro Bakery",
  "Sunrise Wedding Hall",
  "Campus Canteen",
  "Spice Route Kitchen",
  "Harvest Hub",
  "Daily Fresh Market",
  "Crown Banquets",
  "Nest Cafe",
  "Urban Pantry",
  "Ceylon Curry House",
];

const ITEMS = [
  ["Assorted Pastries", 4.2],
  ["Mixed Salads", 3.1],
  ["Bread & Rolls", 6.0],
  ["Rice Packs", 8.5],
  ["Vegetable Curry", 5.2],
  ["Sandwich Platters", 7.0],
  ["Fruit Trays", 4.8],
  ["Soup Containers", 3.6],
  ["Cookie Boxes", 2.4],
  ["Milk Cartons", 5.0],
  ["Pasta Trays", 6.8],
  ["Juice Bottles", 4.0],
  ["Roti Sets", 5.5],
  ["Cake Slices", 3.2],
  ["Egg Curry Packs", 4.7],
  ["Fresh Vegetables", 9.0],
  ["Banana Bunches", 6.2],
  ["Yogurt Cups", 3.8],
  ["Vegan Wraps", 4.4],
  ["Biryani Packs", 7.5],
];

const RECS = [
  "Central Community Center",
  "City Shelter",
  "Hope Community Kitchen",
  "Neighborhood Kitchen",
  "NGO Food Bank",
  "Elder Care Home",
  "School Feeding Program",
  "Temple Relief Kitchen",
];

const AREAS = [
  { label: "Gampaha", lat: 7.084, lng: 80.01 },
  { label: "Nugegoda", lat: 6.872, lng: 79.889 },
  { label: "Colombo", lat: 6.927, lng: 79.861 },
  { label: "Negombo", lat: 7.209, lng: 79.838 },
  { label: "Kadawatha", lat: 7.001, lng: 79.95 },
  { label: "Ja-Ela", lat: 7.074, lng: 79.892 },
  { label: "Kelaniya", lat: 6.955, lng: 79.922 },
  { label: "Kiribathgoda", lat: 6.978, lng: 79.928 },
];

function jitter(n, amount = 0.012) {
  return n + (Math.random() * 2 - 1) * amount;
}

async function seed() {
  await connectDB();

  const driver = await Driver.findOne({ email: "demo.driver@foodloop.com" });
  if (!driver) {
    throw new Error("Demo driver missing. Create demo.driver@foodloop.com first.");
  }

  await Pickup.deleteMany({});

  const docs = [];
  const now = Date.now();

  for (let i = 1; i <= 40; i += 1) {
    const area = AREAS[i % AREAS.length];
    const item = ITEMS[i % ITEMS.length];
    const pickupLoc = { lat: jitter(area.lat), lng: jitter(area.lng) };
    const drop = AREAS[(i + 3) % AREAS.length];
    const dropLoc = {
      lat: jitter(drop.lat, 0.008),
      lng: jitter(drop.lng, 0.008),
    };

    docs.push({
      trackingId: `FL-AVL-${String(i).padStart(3, "0")}`,
      donorName: DONORS[i % DONORS.length],
      itemLabel: item[0],
      weightKg: Number((item[1] + (i % 5) * 0.3).toFixed(1)),
      distanceKm: Number((0.4 + (i % 12) * 0.25).toFixed(1)),
      locationLabel: area.label,
      recipientLabel: RECS[i % RECS.length],
      pickupLocation: pickupLoc,
      dropoffLocation: dropLoc,
      driverLocation: {
        lat: jitter(area.lat, 0.004),
        lng: jitter(area.lng, 0.004),
      },
      expiresAt: new Date(now + (10 + i * 3) * 60 * 1000),
      status: "available",
      etaMinutes: 8 + (i % 20),
    });
  }

  for (let i = 1; i <= 8; i += 1) {
    const area = AREAS[i % AREAS.length];
    const item = ITEMS[(i + 4) % ITEMS.length];
    const pickupLoc = { lat: jitter(area.lat), lng: jitter(area.lng) };
    const drop = AREAS[(i + 2) % AREAS.length];
    const dropLoc = {
      lat: jitter(drop.lat, 0.008),
      lng: jitter(drop.lng, 0.008),
    };
    const mid = {
      lat: (pickupLoc.lat + dropLoc.lat) / 2,
      lng: (pickupLoc.lng + dropLoc.lng) / 2,
    };

    docs.push({
      trackingId: `FL-TRN-${String(i).padStart(3, "0")}`,
      donorName: DONORS[(i + 2) % DONORS.length],
      itemLabel: item[0],
      weightKg: Number(item[1].toFixed(1)),
      distanceKm: Number((1.0 + i * 0.2).toFixed(1)),
      locationLabel: area.label,
      recipientLabel: RECS[(i + 1) % RECS.length],
      pickupLocation: pickupLoc,
      dropoffLocation: dropLoc,
      driverLocation: mid,
      expiresAt: new Date(now + 90 * 60 * 1000),
      status: "in_transit",
      driver: driver._id,
      etaMinutes: 12 + i,
      journey: [
        {
          title: "Item Listed",
          detail: "Donation confirmed by Donor",
          timeLabel: new Date(now - 3600000).toLocaleString(),
          status: "done",
          tone: "green",
        },
        {
          title: "With Volunteer",
          detail: `Picked up by ${driver.name}`,
          timeLabel: new Date(now - 1800000).toLocaleString(),
          status: "active",
          tone: "blue",
          badge: "On the way",
        },
        {
          title: "Reached the Needy",
          detail: "Pending Drop-off",
          timeLabel: "Estimated soon",
          status: "pending",
          tone: "red",
        },
      ],
    });
  }

  for (let i = 1; i <= 20; i += 1) {
    const area = AREAS[i % AREAS.length];
    const item = ITEMS[(i + 7) % ITEMS.length];
    const pickupLoc = { lat: jitter(area.lat), lng: jitter(area.lng) };
    const drop = AREAS[(i + 1) % AREAS.length];
    const dropLoc = {
      lat: jitter(drop.lat, 0.008),
      lng: jitter(drop.lng, 0.008),
    };

    docs.push({
      trackingId: `FL-CMP-${String(i).padStart(3, "0")}`,
      donorName: DONORS[(i + 5) % DONORS.length],
      itemLabel: item[0],
      weightKg: Number(item[1].toFixed(1)),
      distanceKm: 0,
      locationLabel: area.label,
      recipientLabel: RECS[i % RECS.length],
      pickupLocation: pickupLoc,
      dropoffLocation: dropLoc,
      driverLocation: dropLoc,
      expiresAt: new Date(now - i * 3600000),
      status: "completed",
      driver: driver._id,
      etaMinutes: 0,
      journey: [
        {
          title: "Item Listed",
          detail: "Donation confirmed by Donor",
          timeLabel: new Date(now - i * 7200000).toLocaleString(),
          status: "done",
          tone: "green",
        },
        {
          title: "With Volunteer",
          detail: `Picked up by ${driver.name}`,
          timeLabel: new Date(now - i * 5400000).toLocaleString(),
          status: "done",
          tone: "blue",
          badge: "On the way",
        },
        {
          title: "Reached the Needy",
          detail: `Delivered to ${RECS[i % RECS.length]}`,
          timeLabel: new Date(now - i * 3600000).toLocaleString(),
          status: "done",
          tone: "green",
          badge: "Delivered",
        },
      ],
      createdAt: new Date(now - i * 86400000),
      updatedAt: new Date(now - i * 3600000),
    });
  }

  await Pickup.insertMany(docs);

  console.log({
    total: await Pickup.countDocuments(),
    available: await Pickup.countDocuments({ status: "available" }),
    in_transit: await Pickup.countDocuments({ status: "in_transit" }),
    completed: await Pickup.countDocuments({ status: "completed" }),
    driverId: driver._id.toString(),
  });

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  try {
    await mongoose.connection.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
