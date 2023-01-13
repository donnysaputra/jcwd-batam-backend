const database = require("../database/db.json");
const savedJSON = require("../database/write-json");
const db = require("../database/config");

const expensesController = {
  getExpensesList: (req, res) => {
    const qString = "select * from expenses";
    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: "fetched data failed",
        });
      }
      res.status(200).json({
        message: "data fetched",
        result: result,
      });
    });
  },
  getExpenseDetail: (req, res) => {
    const id = req.params.id;

    const qString = "select * from expenses where id = " + id;
    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: "fetched data failed",
        });
      }
      res.status(200).json({
        message: "data fetched",
        result: result[0],
      });
    });
  },
  getTotalExpenseByCategory: (req, res) => {
    const cat = req.query.category;
    const qString = `select sum(nominal) as Total from expenses where category = "${cat}" `;

    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: "fetched data failed",
        });
      }
      res.status(200).json({
        message: "data fetched",
        result: result[0].Total,
      });
    });
  },
  getTotalExpenseByDateRange: (req, res) => {
    const { datefrom, dateto } = req.query;

    const qString = `select sum(nominal) as total from expenses where duedate between '${datefrom}' and '${dateto}'`;
    console.log(qString);

    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: err,
        });
      }
      res.status(200).json({
        message: "data fetched",
        result: result[0].total,
      });
    });
  },
  createExpense: (req, res) => {
    try {
      const { name, nominal, category, duedate } = req.body;

      const qString = `insert into expenses (name,nominal,category,duedate) 
      values ('${name}',${nominal},"${category}","${duedate}" ) `;

      db.query(qString, (err, result) => {
        if (err) {
          res.status(400).json({
            message: err,
          });
        }
        res.status(200).json({
          message: "new data created",
        });
      });
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
  editExpense: (req, res) => {
    try {
      const id = req.params.id;

      let strEdit = "";
      const data = Object.entries(req.body);
      data.map((val, index) => {
        if (index > 0) {
          strEdit += ", ";
        }

        strEdit += `${val[0]} = '${val[1]}' `;
      });
      console.log(strEdit);

      const qString = `update expenses set ${strEdit} where id = ${id};`;
      console.log(qString);

      db.query(qString, (err, result) => {
        if (err) {
          res.status(400).json({
            message: err,
          });
        }
        res.status(200).json({
          message: "data edited",
        });
      });
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
  deleteExpense: (req, res) => {
    const id = req.params.id;
    const qString = `delete from expenses where id = ${id}`;

    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: err,
        });
      }
      res.status(200).json({
        message: "data deleted",
      });
    });
  },
};

module.exports = expensesController;
