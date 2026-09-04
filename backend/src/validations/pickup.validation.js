const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

function validateObjectId(value, label) {
  if (!value) {
    throw new ApiError(400, `${label} is required`);
  }
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${label} is invalid`);
  }
}

function requireDriverInBody(req, res, next) {
  try {
    validateObjectId(req.params.id, "Pickup id");
    validateObjectId(req.body.driverId, "driverId");
    next();
  } catch (error) {
    next(error);
  }
}

function requireLocationUpdate(req, res, next) {
  try {
    validateObjectId(req.params.id, "Pickup id");
    validateObjectId(req.body.driverId, "driverId");
    const lat = Number(req.body.lat);
    const lng = Number(req.body.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new ApiError(400, "Valid lat and lng are required");
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new ApiError(400, "lat/lng out of range");
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  confirmPickup: requireDriverInBody,
  completePickup: requireDriverInBody,
  updateLocation: requireLocationUpdate,
};
