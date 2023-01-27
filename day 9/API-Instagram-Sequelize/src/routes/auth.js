const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { validate2, userValidator } = require("../middlewares/validator");
const { upload } = require("../middlewares/multer");

// router.post("/v1", authController.login);
// router.post("/v2", userValidator(), validate2, authController.register);

router.post("/v1", userValidator(), validate2, authController.registerV2);
router.post("/v2", authController.loginV2);
router.patch("/v3/:id", upload.single("image"), authController.editProfile);
router.get("/avatar/:id", authController.renderAvatar);

router.get("/keep", authController.keeplogin);

router.get("/", authController.getUserByUsername);
router.get("/verified/:token", authController.verifiedUser);

router.get("/resend/:id", authController.resendEmail);

module.exports = router;
