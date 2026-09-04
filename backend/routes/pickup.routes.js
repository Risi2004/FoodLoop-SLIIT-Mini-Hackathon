const express = require("express");
const controller = require("../controllers/pickup.controller");
const validation = require("../validations/pickup.validation");

const router = express.Router();

router.get("/available", controller.getAvailable);
router.get("/my/:driverId", controller.getMyPickups);
router.get("/tracking/:trackingId", controller.getTracking);
router.post("/:id/confirm", validation.confirmPickup, controller.confirmPickup);
router.post("/:id/complete", validation.completePickup, controller.completePickup);

module.exports = router;
