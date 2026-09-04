const mongoose = require("mongoose");
const ApiError = require("../middleware/ApiError");

const UPDATABLE_FIELDS = [
  "name",
  "email",
  "contactNo",
  "address",
  "vehicleType",
  "vehicleNumber",
];

function validateDriverId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Driver id is invalid"));
  }
  next();
}

function validateUpdateDriver(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Driver id is invalid"));
  }

  const updates = {};
  for (const key of UPDATABLE_FIELDS) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return next(new ApiError(400, "No valid profile fields provided"));
  }

  // Only the sanitized, whitelisted fields reach the controller/service.
  req.validatedUpdates = updates;
  next();
}

module.exports = {
  validateDriverId,
  validateUpdateDriver,
};
