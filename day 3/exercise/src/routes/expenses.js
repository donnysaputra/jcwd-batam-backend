const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expenses");

//localhost:2000/expenses/
// router.get("/", controller )

router.get("/", expensesController.getExpensesList);
router.post("/", expensesController.createExpense);

router.get("/total-by-date", expensesController.getTotalExpenseByDateRange);
router.get("/total-by-category", expensesController.getTotalExpenseByCategory);
router.get("/:id", expensesController.getExpenseDetail);
router.patch("/:id", expensesController.editExpense);
router.delete("/:id", expensesController.deleteExpense);

module.exports = router;
