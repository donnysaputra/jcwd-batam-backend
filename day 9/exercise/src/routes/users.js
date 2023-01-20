const { usersController } = require("../controllers");
const express = require("express");
const router = express.Router();

router.post("/v1", usersController.register);
router.post("/v2", usersController.login);
router.patch("/:id", usersController.editProfile);

module.exports = router;
