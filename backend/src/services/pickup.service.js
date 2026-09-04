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

  const current = await Pickup.findOne({ _id: pickupId, status: "available" });
  if (!current) {
    throw new ApiError(409, "Pickup is not available");
  }

  const startLocation =
    current.driverLocation ||
    current.pickupLocation ||
    null;

  const pickup = await Pickup.findOneAndUpdate(
    { _id: pickupId, status: "available" },
    {
      status: "in_transit",
      driver: driver._id,
      journey: buildConfirmJourney(driver.name),
      ...(startLocation ? { driverLocation: startLocation } : {}),
    },
    { new: true }
  ).populate("driver", "name role vehicleType vehicleNumber");

  if (!pickup) {
    throw new ApiError(409, "Pickup is not available");
  }

  return pickup;
}

function haversineKm(a, b) {
  if (!a || !b) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Number((2 * R * Math.asin(Math.sqrt(h))).toFixed(2));
}

async function updateDriverLocation(pickupId, driverId, location) {
  const lat = Number(location?.lat);
  const lng = Number(location?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    throw new ApiError(400, "Valid lat and lng are required");
  }

  const pickup = await Pickup.findOne({
    _id: pickupId,
    driver: driverId,
    status: "in_transit",
  });

  if (!pickup) {
    throw new ApiError(404, "In-transit pickup not found for this driver");
  }

  pickup.driverLocation = { lat, lng };

  const remainingKm = haversineKm(pickup.driverLocation, pickup.dropoffLocation);
  if (remainingKm != null) {
    pickup.distanceKm = remainingKm;
    pickup.etaMinutes = Math.max(1, Math.round((remainingKm / 25) * 60));
  }

  await pickup.save();

  return Pickup.findById(pickup._id)
    .populate("driver", "name role vehicleType vehicleNumber stats")
    .lean();
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

  const nowLabel = new Date().toLocaleString();
  const mealsSaved = Math.max(1, Math.round((pickup.weightKg || 1) * 2));
  const traveledKm = Number((pickup.distanceKm || 0).toFixed(1));

  if (pickup.dropoffLocation?.lat != null) {
    pickup.driverLocation = {
      lat: pickup.dropoffLocation.lat,
      lng: pickup.dropoffLocation.lng,
    };
  }

  pickup.status = "completed";
  pickup.distanceKm = 0;
  pickup.etaMinutes = 0;
  pickup.journey = (pickup.journey || []).map((step, index, arr) => {
    const isLast = index === arr.length - 1;
    return {
      title: step.title,
      detail: isLast
        ? `Delivered to ${pickup.recipientLabel || "recipient"}`
        : step.detail,
      timeLabel: isLast ? nowLabel : step.timeLabel,
      tone: step.tone,
      badge: isLast ? "Delivered" : step.badge || "",
      status: "done",
    };
  });

  if (!pickup.journey.length) {
    pickup.journey = [
      {
        title: "Reached the Needy",
        detail: `Delivered to ${pickup.recipientLabel || "recipient"}`,
        timeLabel: nowLabel,
        status: "done",
        tone: "green",
        badge: "Delivered",
      },
    ];
  }

  await pickup.save();

  await Driver.findByIdAndUpdate(driverId, {
    $inc: {
      "stats.deliveriesCompleted": 1,
      "stats.distanceKm": traveledKm,
      "stats.impactCurrent": 1,
      "stats.mealsSaved": mealsSaved,
    },
  });

  const completed = await Pickup.findById(pickup._id)
    .populate("driver", "name role vehicleType vehicleNumber stats")
    .lean();

  return {
    ...completed,
    impact: {
      distanceKm: traveledKm,
      peopleFed: mealsSaved,
      methaneSavedKg: Number(((pickup.weightKg || 1) * 0.05).toFixed(2)),
    },
  };
}

module.exports = {
  getAvailablePickups,
  getDriverPickups,
  getTrackingDetails,
  confirmPickup,
  updateDriverLocation,
  completePickup,
};
