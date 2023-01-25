const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");

router.post("/v1", authController.register);
router.post("/v2", authController.login);
router.post("/admin", authController.loginAdmin);

module.exports = router;
