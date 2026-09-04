const Driver = require("../models/Driver");
const ApiError = require("../utils/ApiError");
const { USER_ROLES } = require("../config/constants");

function normalizeVehicleType(value) {
  const allowed = ["scooter", "motorcycle", "car", "truck"];
  const next = String(value || "scooter").toLowerCase();
  return allowed.includes(next) ? next : "scooter";
}

async function getDriverById(id) {
  const driver = await Driver.findById(id).lean();

  if (!driver) {
    throw new ApiError(404, "Driver not found");
  }

  return driver;
}

/**
 * Resolve (or create) the pickup Driver profile for a logged-in auth User.
 */
async function ensureDriverForUser(user) {
  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  const role = String(user.role || "").toUpperCase();
  if (role !== USER_ROLES.DRIVER) {
    throw new ApiError(403, "Only driver accounts can access driver logistics profiles");
  }

  const email = String(user.email || "").toLowerCase().trim();
  if (!email) {
    throw new ApiError(400, "Driver account is missing an email");
  }

  let driver =
    (user._id && (await Driver.findOne({ userId: user._id }))) ||
    (await Driver.findOne({ email }));

  if (driver) {
    let dirty = false;
    if (!driver.userId && user._id) {
      driver.userId = user._id;
      dirty = true;
    }
    if (user.driverName && driver.name !== user.driverName) {
      driver.name = user.driverName;
      dirty = true;
    }
    if (user.contactNo && driver.contactNo !== user.contactNo) {
      driver.contactNo = user.contactNo;
      dirty = true;
    }
    if (user.address && driver.address !== user.address) {
      driver.address = user.address;
      dirty = true;
    }
    if (dirty) await driver.save();
    return driver.toObject ? driver.toObject() : driver;
  }

  driver = await Driver.create({
    userId: user._id,
    name: user.driverName || email.split("@")[0],
    email,
    contactNo: user.contactNo || "Not provided",
    address: user.address || "Not provided",
    vehicleType: normalizeVehicleType(user.vehicleType),
    vehicleNumber: user.vehicleNumber || "",
  });

  return driver.toObject();
}

async function getMyDriver(user) {
  return ensureDriverForUser(user);
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

async function updateMyDriver(user, updates) {
  const current = await ensureDriverForUser(user);
  return updateDriver(current._id, updates);
}

module.exports = {
  getDriverById,
  ensureDriverForUser,
  getMyDriver,
  updateDriver,
  updateMyDriver,
};
