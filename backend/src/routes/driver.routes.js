const express = require("express");
const controller = require("../controllers/driver.controller");
const validation = require("../validations/driver.validation");

const router = express.Router();

router.get("/:id", validation.validateDriverId, controller.getDriver);
router.patch("/:id", validation.validateUpdateDriver, controller.updateDriver);

module.exports = router;
