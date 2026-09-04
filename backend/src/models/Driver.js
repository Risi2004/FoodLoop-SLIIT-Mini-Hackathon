const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, required: true },
    verified: { type: Boolean, default: true },
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
  },
  { _id: false }
);

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    role: { type: String, default: "Volunteer Driver" },
    vehicleType: {
      type: String,
      enum: ["scooter", "motorcycle", "car", "truck"],
      default: "scooter",
    },
    vehicleNumber: { type: String, default: "", trim: true },
    joinedAt: { type: Date, default: Date.now },
    verification: {
      type: [verificationSchema],
      default: [
        { title: "NIC Verified", detail: "Identity confirmed", verified: true },
        {
          title: "License Valid",
          detail: "Class B Driver License",
          verified: true,
        },
      ],
    },
    badges: {
      type: [badgeSchema],
      default: [
        { label: "Faster" },
        { label: "Centurion" },
        { label: "Best" },
      ],
    },
    stats: {
      deliveriesCompleted: { type: Number, default: 0 },
      distanceKm: { type: Number, default: 0 },
      mealsSaved: { type: Number, default: 0 },
      impactCurrent: { type: Number, default: 0 },
      impactGoal: { type: Number, default: 15 },
      impactBadge: { type: String, default: "Community Hero" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
