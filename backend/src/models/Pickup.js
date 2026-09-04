const mongoose = require("mongoose");

const journeyStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, required: true },
    timeLabel: { type: String, default: "" },
    status: {
      type: String,
      enum: ["done", "active", "pending"],
      default: "pending",
    },
    tone: {
      type: String,
      enum: ["green", "blue", "red"],
      default: "green",
    },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const geoPointSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const pickupSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true, trim: true },
    donorName: { type: String, required: true, trim: true },
    itemLabel: { type: String, required: true, trim: true },
    weightKg: { type: Number, required: true, min: 0 },
    distanceKm: { type: Number, default: 0, min: 0 },
    locationLabel: { type: String, default: "", trim: true },
    recipientLabel: { type: String, default: "", trim: true },
    pickupLocation: { type: geoPointSchema, default: null },
    dropoffLocation: { type: geoPointSchema, default: null },
    driverLocation: { type: geoPointSchema, default: null },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ["available", "in_transit", "completed", "cancelled"],
      default: "available",
      index: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
      index: true,
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      default: null,
      index: true,
    },
    etaMinutes: { type: Number, default: 15 },
    journey: { type: [journeyStepSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);
