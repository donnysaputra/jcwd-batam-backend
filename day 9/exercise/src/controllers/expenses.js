const db = require("../models");
const Users = db.user;
const Expense = db.expenses;
const Currencies = db.currency;

const { Convert } = require("easy-currencies");

const { Op } = require("sequelize");
const { user, category, currency, sequelize, Sequelize } = require("../models");

const expensesController = {
  createData: async (req, res) => {
    const { duedate, price, user_id, category_id, currency_id } = req.body;
    const expense = {
      duedate: duedate,
      price: price,
      user_id: user_id,
      category_id: category_id,
      currency_id: currency_id,
    };

    const result = await Expense.create({
      ...expense,
    });

    return res.status(200).json({
      message: "data berhasil ditambahkan",
      result: result,
    });
  },
  editData: async (req, res) => {
    try {
      const id = req.params.id;

      const result = await Expense.update(
        {
          ...req.body,
        },
        {
          where: {
            id: id,
          },
        }
      );

      return result
        ? res.status(200).json({
            message: "data berhasil diedit",
          })
        : res.status(400).json({
            message: "data gagal diedit",
          });
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const id = req.params.id;

      await Expense.destroy({
        where: {
          id: id,
        },
      });

      return res.status(400).json({
        message: "data berhasil didelete",
      });
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
  getTotalbyCategory: async (req, res) => {
    try {
      const catParams = req.query.category;
      const userId = req.query.user_id;

      const result = await Expense.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],

        include: [
          {
            model: category,
            attributes: ["category"],
            // where: {
            //   category: catParams,
            // },
          },
        ],
        where: {
          user_id: userId,
        },
        group: ["category_id"],
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "error",
      });
    }
  },
  getTotalbyDate: async (req, res) => {
    try {
      const datefrom = req.query.datefrom;
      const dateto = req.query.dateto;

      console.log(datefrom);
      console.log(dateto);

      const result = await Expense.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],

        where: {
          duedate: {
            [Op.between]: [datefrom, dateto],
          },
        },
        group: ["duedate"],
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getTotalbyMonth: async (req, res) => {
    try {
      const month = req.query.month;

      const result = await Expense.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],

        where: sequelize.where(
          sequelize.fn("month", sequelize.col("duedate")),
          month
        ),
        group: [sequelize.fn("month", sequelize.col("duedate"))],
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getTotalbyYear: async (req, res) => {
    try {
      const year = req.query.year;

      const result = await Expense.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("price")), "total"],
          [sequelize.fn("year", sequelize.col("duedate")), "year"],
        ],

        where: sequelize.where(
          sequelize.fn("year", sequelize.col("duedate")),
          year
        ),
        group: [sequelize.fn("year", sequelize.col("duedate"))],
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getTotalbyDay: async (req, res) => {
    try {
      const day = req.query.day;

      const result = await Expense.findAll({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],

        where: sequelize.where(
          sequelize.fn("day", sequelize.col("duedate")),
          day
        ),
        group: [sequelize.fn("day", sequelize.col("duedate"))],
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getDailyTrans: async (req, res) => {
    try {
      const catParams = req.query.category
        ? {
            where: { category: req.query.category },
          }
        : null;

      const dateParam =
        req.query.datefrom && req.query.dateto
          ? {
              where: {
                duedate: {
                  [Op.between]: [req.query.datefrom, req.query.dateto],
                },
              },
            }
          : null;

      console.log(req.query.datefrom);
      console.log(req.query.dateto);

      const result = await Expense.findAll({
        include: [
          {
            model: category,
            ...catParams,
          },
          {
            model: user,
          },
          {
            model: currency,
          },
        ],
        ...dateParam,
      });

      return res.status(400).json({
        message: "fetched data",
        result: result,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "error",
      });
    }
  },
  convertCurrency: async (req, res) => {
    const userId = req.query.userId;
    const expenses = await Expense.findAll({
      where: {
        user_id: userId,
      },
    });

    const currentCurrency = await Currencies.findOne({
      where: {
        id: expenses[0].currency_id,
      },
    });

    const newCurrency = await Currencies.findOne({
      where: {
        id: req.query.new_currency_id,
      },
    });

    console.log(currentCurrency.currency);
    console.log(newCurrency.currency);

    expenses.map(async (val) => {
      const newPrice = await Convert(val.price)
        .from(currentCurrency.currency)
        .to(newCurrency.currency);

      console.log(newPrice);
      await Expense.update(
        {
          price: newPrice,
          currency_id: newCurrency.id,
        },
        {
          where: {
            id: val.id,
          },
        }
      );

      await Users.update(
        {
          currency_id: newCurrency.id,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    });

    res.send("new conversion");
  },
};

module.exports = expensesController;
