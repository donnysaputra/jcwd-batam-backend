const express = require("express");
const router = express.Router();
const { eventController } = require("../controllers");
const { checkRole } = require("../middlewares/auth");
const { fileUploader } = require("../middlewares/multer");
router.get("/", eventController.getAvailableEvents);
router.post("/ticket", eventController.buyticket);
router.post("/", checkRole, eventController.createEvent);
router.get("/user/:id", eventController.history);
router.get("/:event_id/attendance", eventController.eventAttendance);
router.post(
  "/ticket/:userId/proof",
  fileUploader({
    fileType: "image",
    prefix: "POST",
  }).single("image"),
  eventController.paymentProof
);

router.post("/transactions/:id/approve", eventController.approvePayment);
router.post("/transactions/:id/reject", eventController.rejectPayment);

module.exports = router;
