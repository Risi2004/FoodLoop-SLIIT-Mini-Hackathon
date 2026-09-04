const Driver = require("../models/Driver");
const ApiError = require("../middleware/ApiError");

async function getDriverById(id) {
  const driver = await Driver.findById(id).lean();

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  return driver;
}

async function updateDriver(id, updates) {
  const driver = await Driver.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  return driver;
}

module.exports = {
  getDriverById,
  updateDriver,
};
