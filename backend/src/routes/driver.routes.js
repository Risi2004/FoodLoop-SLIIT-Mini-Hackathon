const express = require("express");
const controller = require("../controllers/driver.controller");
const validation = require("../validations/driver.validation");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../config/constants");

const router = express.Router();

router.get(
  "/me",
  authenticate,
  authorize(USER_ROLES.DRIVER),
  controller.getMyDriver
);

router.patch(
  "/me",
  authenticate,
  authorize(USER_ROLES.DRIVER),
  validation.validateUpdateMyDriver,
  controller.updateMyDriver
);

router.get("/:id", validation.validateDriverId, controller.getDriver);
router.patch("/:id", validation.validateUpdateDriver, controller.updateDriver);

module.exports = router;
