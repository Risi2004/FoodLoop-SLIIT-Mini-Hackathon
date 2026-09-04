const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

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

function collectUpdates(body) {
  const updates = {};
  for (const key of UPDATABLE_FIELDS) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }
  return updates;
}

function validateUpdateDriver(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Driver id is invalid"));
  }

  const updates = collectUpdates(req.body);
  if (Object.keys(updates).length === 0) {
    return next(new ApiError(400, "No valid profile fields provided"));
  }

  req.validatedUpdates = updates;
  next();
}

function validateUpdateMyDriver(req, res, next) {
  const updates = collectUpdates(req.body);
  if (Object.keys(updates).length === 0) {
    return next(new ApiError(400, "No valid profile fields provided"));
  }

  req.validatedUpdates = updates;
  next();
}

module.exports = {
  validateDriverId,
  validateUpdateDriver,
  validateUpdateMyDriver,
};
