const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const {
  userValidationRules,
  validate,
  validate2,
  userValidator,
} = require("../middlewares/validator");
// const { body, validationResult } = require("express-validator");

router.post("/v1", authController.login);
// router.post("/v2", userValidationRules(), validate, authController.register);
router.post("/v2", userValidator(), validate2, authController.register);

router.post("/v3", authController.registerV2);
router.post("/v4", authController.loginV2);
router.post("/keep", authController.keeplogin);

router.get("/", authController.getUserByUsername);

module.exports = router;
