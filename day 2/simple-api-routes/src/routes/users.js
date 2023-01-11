const express = require("express");
const router = express.Router();

const { usersController } = require("../controllers");
const validateKeys = require("../middleware/validateKeys");
router.use(validateKeys);

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);
router.patch("/:id", usersController.editUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
