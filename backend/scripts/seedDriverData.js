require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Driver = require("../src/models/Driver");
const Pickup = require("../src/models/Pickup");

async function seed() {
  await connectDB();

  await Promise.all([Driver.deleteMany({}), Pickup.deleteMany({})]);

  const driver = await Driver.create({
    name: "Alex Driver",
    email: "alex.driver@foodloop.test",
    contactNo: "+94 75 862 6485",
    address: "123 Sustainability Way, Colombo, EC 5021",
    vehicleType: "scooter",
    vehicleNumber: "BYD - 2418",
    joinedAt: new Date("2023-05-01"),
    stats: {
      deliveriesCompleted: 124,
      distanceKm: 450,
      mealsSaved: 820,
      impactCurrent: 12,
      impactGoal: 15,
      impactBadge: "Community Hero",
    },
  });

  const availablePickups = [
    {
      trackingId: "FL-AVAIL-001",
      donorName: "Fresh Bakes Bakery",
      itemLabel: "Assorted Pastries",
      weightKg: 4.2,
      distanceKm: 0.5,
      locationLabel: "Gampaha",
      recipientLabel: "Central Community Center",
      pickupLocation: { lat: 7.091, lng: 80.002 },
      dropoffLocation: { lat: 7.075, lng: 80.02 },
      driverLocation: { lat: 7.084, lng: 80.01 },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: "available",
    },
    {
      trackingId: "FL-AVAIL-002",
      donorName: "Green Leaf Cafe",
      itemLabel: "Mixed Salads",
      weightKg: 3.1,
      distanceKm: 1.2,
      locationLabel: "Nugegoda",
      recipientLabel: "City Shelter",
      pickupLocation: { lat: 6.872, lng: 79.889 },
      dropoffLocation: { lat: 6.879, lng: 79.901 },
      driverLocation: { lat: 6.865, lng: 79.9 },
      expiresAt: new Date(Date.now() + 25 * 60 * 1000),
      status: "available",
    },
    {
      trackingId: "FL-AVAIL-003",
      donorName: "City Mart",
      itemLabel: "Bread & Rolls",
      weightKg: 6.0,
      distanceKm: 1.5,
      locationLabel: "Colombo",
      recipientLabel: "Neighborhood Kitchen",
      pickupLocation: { lat: 6.9271, lng: 79.8612 },
      dropoffLocation: { lat: 6.935, lng: 79.85 },
      driverLocation: { lat: 6.922, lng: 79.87 },
      expiresAt: new Date(Date.now() + 40 * 60 * 1000),
      status: "available",
    },
  ];

  const inTransit = {
    trackingId: "FL-8829-01",
    donorName: "Fresh Bakes Bakery",
    itemLabel: "Assorted Pastries",
    weightKg: 4.2,
    distanceKm: 0.5,
    locationLabel: "Gampaha",
    recipientLabel: "Central Community Center",
    pickupLocation: { lat: 7.091, lng: 80.002 },
    dropoffLocation: { lat: 7.075, lng: 80.02 },
    driverLocation: { lat: 7.084, lng: 80.01 },
    status: "in_transit",
    driver: driver._id,
    etaMinutes: 15,
    journey: [
      {
        title: "Item Listed",
        detail: "Donation confirmed by Donor",
        timeLabel: "Oct 26, 11:30 AM",
        status: "done",
        tone: "green",
      },
      {
        title: "With Volunteer",
        detail: "Picked up by Alex Driver",
        timeLabel: "Oct 26, 12:15 PM",
        status: "active",
        tone: "blue",
        badge: "On the way",
      },
      {
        title: "Reached the Needy",
        detail: "Pending Drop-off",
        timeLabel: "Estimated arrival: 12:45 PM",
        status: "pending",
        tone: "red",
      },
    ],
  };

  const completed = [
    {
      trackingId: "FL-DONE-001",
      donorName: "Fresh Bakes Bakery",
      itemLabel: "Assorted Pastries",
      weightKg: 4.2,
      distanceKm: 2.5,
      locationLabel: "Colombo",
      recipientLabel: "Central Community Center",
      pickupLocation: { lat: 6.9271, lng: 79.8612 },
      dropoffLocation: { lat: 6.935, lng: 79.85 },
      status: "completed",
      driver: driver._id,
    },
    {
      trackingId: "FL-DONE-002",
      donorName: "Fresh Bakes Bakery",
      itemLabel: "Assorted Pastries",
      weightKg: 4.2,
      distanceKm: 2.5,
      locationLabel: "Colombo",
      recipientLabel: "Central Community Center",
      pickupLocation: { lat: 6.9271, lng: 79.8612 },
      dropoffLocation: { lat: 6.94, lng: 79.855 },
      status: "completed",
      driver: driver._id,
    },
  ];

  await Pickup.insertMany([...availablePickups, inTransit, ...completed]);

  console.log("Seed complete");
  console.log(`Driver ID: ${driver._id}`);
  console.log("Tracking ID: FL-8829-01");
  console.log(`Available pickups: ${availablePickups.length}`);

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.connection.close();
  process.exit(1);
});
