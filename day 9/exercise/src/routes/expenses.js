const { expensesController } = require("../controllers");
const express = require("express");
const router = express.Router();

router.post("/", expensesController.createData);
router.get("/categories", expensesController.getTotalbyCategory);
router.get("/date", expensesController.getTotalbyCategory);
router.get("/month", expensesController.getTotalbyMonth);
router.get("/year", expensesController.getTotalbyYear);
router.get("/day", expensesController.getTotalbyDay);
router.post("/currency", expensesController.convertCurrency);

router.patch("/:id", expensesController.editData);
router.delete("/:id", expensesController.delete);

router.get("/log", expensesController.getDailyTrans);

module.exports = router;
