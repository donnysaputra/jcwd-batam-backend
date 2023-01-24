const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const { verifyToken, checkRole } = require("../middlewares/auth");
router.post("/v1", authController.register);
router.post("/v2", authController.login);
router.patch("/v3", verifyToken, authController.editPassword);
router.patch("/v4", verifyToken, checkRole, authController.editRole);

module.exports = router;
