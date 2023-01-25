const express = require("express");
const router = express.Router();
const { eventController } = require("../controllers");
const { checkRole } = require("../middlewares/auth");

router.get("/", eventController.getAvailableEvents);
router.post("/ticket", eventController.buyticket);
router.post("/", checkRole, eventController.createEvent);
router.get("/user/:id", eventController.history);
router.get("/:event_id/attendance", eventController.eventAttendance);

module.exports = router;
