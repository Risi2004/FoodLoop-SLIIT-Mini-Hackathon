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

module.exports = {
  confirmPickup: requireDriverInBody,
  completePickup: requireDriverInBody,
};
