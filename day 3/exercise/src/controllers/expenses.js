const database = require("../database/db.json");
const savedJSON = require("../database/write-json");
const expensesController = {
  getExpensesList: (req, res) => {
    res.status(200).json({
      message: "data fetched",
      result: database.expense,
    });
  },
  getExpenseDetail: (req, res) => {
    const id = req.params.id;

    const expense = database.expense.find((val) => {
      return val.id == id;
    });

    res.status(200).json({
      message: "data fetched",
      result: expense,
    });
  },
  getTotalExpenseByCategory: (req, res) => {
    const cat = req.query.category;

    const listExpenses = database.expense.filter((val) => {
      return val.category == cat;
    });
    let total = 0;
    listExpenses.map((val) => {
      total += val.nominal;
    });
    console.log(total);

    res.status(200).json({
      message: "data fetched",
      result: total,
    });
  },
  getTotalExpenseByDateRange: (req, res) => {
    const datefrom = new Date(req.query.datefrom);
    const dateto = new Date(req.query.dateto);
    console.log(datefrom);
    console.log(dateto);

    // let total = 0;
    let objResult = { data: [], total: 0 };
    database.expense.map((val) => {
      const date = new Date(val.duedate);
      if (date >= datefrom && date <= dateto) {
        objResult.data.push(val);
        objResult.total += val.nominal;
      }
    });

    // console.log(`Rp. ${total.toLocaleString()}`);

    res.status(200).json({
      message: "data fetched",
      result: objResult,
    });
  },
  createExpense: (req, res) => {
    try {
      const newId = database.expense[database.expense.length - 1].id + 1;
      // console.log(req.body);
      const expense = {
        id: newId,
        name: req.body.name,
        nominal: req.body.nominal,
        category: req.body.category,
        duedate: req.body.duedate,
      };
      // const expense = req.body;
      // expense.id = newId;
      console.log(expense);

      database.expense.push(expense);
      savedJSON(database);

      res.status(201).json({
        message: "new expense has been created",
        result: expense,
      });
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
  editExpense: (req, res) => {
    const id = req.params.id;
    const expense = req.body;
    expense.id = id;

    const findIndex = database.expense.findIndex((val) => {
      return val.id == id;
    });

    if (findIndex == -1) {
      res.status(400).json({
        message: "id not found",
      });
      return;
    }

    database.expense[findIndex] = {
      ...database.expense[findIndex],
      ...expense,
    };
    savedJSON(database);

    res.status(201).json({
      message: "data edited",
      result: database.expense[findIndex],
    });
  },
  deleteExpense: (req, res) => {
    const id = req.params.id;

    const findIndex = database.expense.findIndex((val) => {
      return val.id == id;
    });

    if (findIndex == -1) {
      res.status(400).json({
        message: "id not found",
      });
      return;
    }

    database.expense.splice(findIndex, 1);
    savedJSON(database);

    res.status(201).json({
      message: "data deleted",
      result: database.expense[findIndex],
    });
  },
};

module.exports = expensesController;
