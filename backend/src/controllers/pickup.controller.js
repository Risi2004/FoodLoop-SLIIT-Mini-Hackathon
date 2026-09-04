const asyncHandler = require("../utils/asyncHandler");
const pickupService = require("../services/pickup.service");

const getAvailable = asyncHandler(async (req, res) => {
  const result = await pickupService.getAvailablePickups();
  res.json(result);
});

const getMyPickups = asyncHandler(async (req, res) => {
  const result = await pickupService.getDriverPickups(req.params.driverId);
  res.json(result);
});

const getTracking = asyncHandler(async (req, res) => {
  const pickup = await pickupService.getTrackingDetails(req.params.trackingId);
  res.json(pickup);
});

const confirmPickup = asyncHandler(async (req, res) => {
  const pickup = await pickupService.confirmPickup(
    req.params.id,
    req.body.driverId
  );
  res.json(pickup);
});

const completePickup = asyncHandler(async (req, res) => {
  const pickup = await pickupService.completePickup(
    req.params.id,
    req.body.driverId
  );
  res.json(pickup);
});

module.exports = {
  getAvailable,
  getMyPickups,
  getTracking,
  confirmPickup,
  completePickup,
};
