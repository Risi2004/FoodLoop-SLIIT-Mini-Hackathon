const express = require("express");
const Driver = require("../models/Driver");

const router = express.Router();

// GET /api/drivers/:id
router.get("/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).lean();

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch driver", error: error.message });
  }
});

// PATCH /api/drivers/:id
router.patch("/:id", async (req, res) => {
  try {
    const allowed = [
      "name",
      "email",
      "contactNo",
      "address",
      "vehicleType",
      "vehicleNumber",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid profile fields provided" });
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.json(driver);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Failed to update driver", error: error.message });
  }
});

module.exports = router;
