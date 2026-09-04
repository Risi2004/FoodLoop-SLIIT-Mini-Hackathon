const Pickup = require("../models/Pickup");
const Driver = require("../models/Driver");
const ApiError = require("../utils/ApiError");

function buildConfirmJourney(driverName) {
  const now = new Date();
  return [
    {
      title: "Item Listed",
      detail: "Donation confirmed by Donor",
      timeLabel: now.toLocaleString(),
      status: "done",
      tone: "green",
    },
    {
      title: "With Volunteer",
      detail: `Picked up by ${driverName}`,
      timeLabel: now.toLocaleString(),
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
  ];
}

async function getAvailablePickups() {
  const pickups = await Pickup.find({ status: "available" })
    .sort({ expiresAt: 1, createdAt: -1 })
    .lean();

  return { count: pickups.length, pickups };
}

async function getDriverPickups(driverId) {
  const [inTransit, completed] = await Promise.all([
    Pickup.find({ driver: driverId, status: "in_transit" })
      .sort({ updatedAt: -1 })
      .lean(),
    Pickup.find({ driver: driverId, status: "completed" })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  return { inTransit, completed };
}

async function getTrackingDetails(trackingId) {
  const pickup = await Pickup.findOne({ trackingId })
    .populate("driver", "name role vehicleType vehicleNumber stats")
    .lean();

  if (!pickup) {
    throw new ApiError(404, "Tracking ID not found");
  }

  return pickup;
}

async function confirmPickup(pickupId, driverId) {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  const pickup = await Pickup.findOneAndUpdate(
    { _id: pickupId, status: "available" },
    {
      status: "in_transit",
      driver: driver._id,
      journey: buildConfirmJourney(driver.name),
    },
    { new: true }
  ).populate("driver", "name role vehicleType vehicleNumber");

  if (!pickup) {
    throw new ApiError(409, "Pickup is not available");
  }

  return pickup;
}

async function completePickup(pickupId, driverId) {
  const pickup = await Pickup.findOne({
    _id: pickupId,
    driver: driverId,
    status: "in_transit",
  });

  if (!pickup) {
    throw new ApiError(404, "In-transit pickup not found for this driver");
  }

  pickup.status = "completed";
  pickup.journey = pickup.journey.map((step) => ({
    title: step.title,
    detail: step.detail,
    timeLabel: step.timeLabel,
    tone: step.tone,
    badge: step.badge || "",
    status: "done",
  }));
  await pickup.save();

  await Driver.findByIdAndUpdate(driverId, {
    $inc: {
      "stats.deliveriesCompleted": 1,
      "stats.distanceKm": pickup.distanceKm || 0,
      "stats.impactCurrent": 1,
      "stats.mealsSaved": 1,
    },
  });

  return pickup;
}

module.exports = {
  getAvailablePickups,
  getDriverPickups,
  getTrackingDetails,
  confirmPickup,
  completePickup,
};
