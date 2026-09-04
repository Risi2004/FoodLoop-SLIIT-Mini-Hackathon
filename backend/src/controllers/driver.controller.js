const asyncHandler = require("../utils/asyncHandler");
const driverService = require("../services/driver.service");

const getMyDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.getMyDriver(req.user);
  res.json(driver);
});

const updateMyDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateMyDriver(
    req.user,
    req.validatedUpdates
  );
  res.json(driver);
});

const getDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);
  res.json(driver);
});

const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(
    req.params.id,
    req.validatedUpdates
  );
  res.json(driver);
});

module.exports = {
  getMyDriver,
  updateMyDriver,
  getDriver,
  updateDriver,
};
