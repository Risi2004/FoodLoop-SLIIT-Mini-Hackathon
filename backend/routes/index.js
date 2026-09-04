const express = require("express");
const pickupRoutes = require("./pickup.routes");
const driverRoutes = require("./driver.routes");

const router = express.Router();

router.use("/pickups", pickupRoutes);
router.use("/drivers", driverRoutes);

module.exports = router;
