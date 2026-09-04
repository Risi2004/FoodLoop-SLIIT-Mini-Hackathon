const express = require("express");
const Pickup = require("../models/Pickup");
const Driver = require("../models/Driver");

const router = express.Router();

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

// GET /api/pickups/available
router.get("/available", async (req, res) => {
  try {
    const pickups = await Pickup.find({ status: "available" })
      .sort({ expiresAt: 1, createdAt: -1 })
      .lean();

    res.json({
      count: pickups.length,
      pickups,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available pickups", error: error.message });
  }
});

// GET /api/pickups/my/:driverId
router.get("/my/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    const [inTransit, completed] = await Promise.all([
      Pickup.find({ driver: driverId, status: "in_transit" })
        .sort({ updatedAt: -1 })
        .lean(),
      Pickup.find({ driver: driverId, status: "completed" })
        .sort({ updatedAt: -1 })
        .lean(),
    ]);

    res.json({ inTransit, completed });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch driver pickups", error: error.message });
  }
});

// GET /api/pickups/tracking/:trackingId
router.get("/tracking/:trackingId", async (req, res) => {
  try {
    const pickup = await Pickup.findOne({ trackingId: req.params.trackingId })
      .populate("driver", "name role vehicleType vehicleNumber stats")
      .lean();

    if (!pickup) {
      return res.status(404).json({ message: "Tracking ID not found" });
    }

    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tracking details", error: error.message });
  }
});

// POST /api/pickups/:id/confirm
router.post("/:id/confirm", async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "driverId is required" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const pickup = await Pickup.findOneAndUpdate(
      { _id: req.params.id, status: "available" },
      {
        status: "in_transit",
        driver: driver._id,
        journey: buildConfirmJourney(driver.name),
      },
      { new: true }
    ).populate("driver", "name role vehicleType vehicleNumber");

    if (!pickup) {
      return res.status(409).json({ message: "Pickup is not available" });
    }

    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm pickup", error: error.message });
  }
});

// POST /api/pickups/:id/complete
router.post("/:id/complete", async (req, res) => {
  try {
    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "driverId is required" });
    }

    const pickup = await Pickup.findOne({
      _id: req.params.id,
      driver: driverId,
      status: "in_transit",
    });

    if (!pickup) {
      return res.status(404).json({ message: "In-transit pickup not found for this driver" });
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

    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: "Failed to complete pickup", error: error.message });
  }
});

module.exports = router;
