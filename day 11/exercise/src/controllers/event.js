const db = require("../models");
const Event = db.event;
const User = db.user;
const mailer = require("../lib/mailer");
const mustache = require("mustache");
const fs = require("fs");
const Transaction = db.transaction;

const { Op } = require("sequelize");
const { nanoid } = require("nanoid");
const { sequelize, transaction } = require("../models");
const eventController = {
  getAvailableEvents: async (req, res) => {
    const date = new Date();
    const result = await Event.findAll({
      where: {
        date: {
          [Op.gt]: date,
        },
        total_ticket: {
          [Op.ne]: 0,
        },
      },
    });

    return res.send(result);
  },
  buyticket: async (req, res) => {
    const { event_id, qty, user_id, price } = req.body;
    const data = {
      transaction_number: "trans_" + nanoid(4),
      total_price: qty * price,
      user_id: user_id,
      qty: qty,
      event_id: event_id,
      status: "menunggu pembayaran",
    };
    const event = await Event.findOne({
      where: {
        id: event_id,
      },
    });

    if (event.total_ticket < qty) {
      return res.status(400).json({
        message: "qty melebihi total ticket",
      });
    }

    if (qty > 3) {
      return res.status(400).json({
        message: "qty melebihi 3 ",
      });
    }

    // await Event.update(
    //   {
    //     total_ticket: event.total_ticket - qty,
    //   },
    //   {
    //     where: {
    //       id: event_id,
    //     },
    //   }
    // );
    const result = await Transaction.create({ ...data });

    res.send(result);
  },
  createEvent: async (req, res) => {
    try {
      const data = {
        event: req.body.event,
        date: req.body.date,
        venue: req.body.venue,
        total_ticket: req.body.total_ticket,
        price: req.body.price,
        admin_id: req.body.admin_id,
      };

      const dataEnt = Object.entries(data);
      // [["event",undefined], ["date": "2023-1-1"]]
      dataEnt.map((val) => {
        if (!val[1]) {
          throw new Error(val[0] + " tidak boleh kosong");
        }
      });

      const result = await Event.create({ ...data });
      res.send(result);
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  history: async (req, res) => {
    const result = await Transaction.findAll({
      include: [Event],
      where: {
        user_id: req.params.id,
      },
    });

    res.send(result);
  },
  eventAttendance: async (req, res) => {
    const result = await Transaction.findAll({
      attributes: [
        "user_id",
        [sequelize.fn("sum", sequelize.col("qty")), "total_seat"],
      ],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],

      where: {
        event_id: req.params.event_id,
      },
      group: "user_id",
    });

    res.send(result);
  },
  paymentProof: async (req, res) => {
    try {
      const payment_url = "http://localhost:2000/proof/" + req.file.filename;
      const user_id = req.params.userId;
      const { trans_id } = req.body;
      console.log(trans_id);

      console.log(req.body);
      const result = await Transaction.update(
        { payment_url },
        {
          where: {
            id: trans_id,
            user_id,
          },
        }
      );

      return res.status(200).json({
        result,
        message: "payment proof updated",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  approvePayment: async (req, res) => {
    const id = req.params.id;
    const { event_id, user_id } = req.body;
    console.log(event_id);
    try {
      await Transaction.update(
        {
          status: "paid",
        },
        {
          where: { id },
        }
      );

      const trans = await Transaction.findByPk(id);

      const event = await Event.findByPk(event_id);

      await Event.update(
        {
          total_ticket: event.dataValues.total_ticket - trans.dataValues.qty,
        },
        {
          where: {
            id: event_id,
          },
        }
      );

      const user = await User.findByPk(user_id);

      const template = fs
        .readFileSync(__dirname + "/../templates/paid.html")
        .toString();

      const date = new Date().toISOString().split("T")[0];

      const renderedTemplate = mustache.render(template, {
        tgl: date,
        event: event.dataValues.event,
        price: event.dataValues.price,
        qty: trans.dataValues.qty,
        total: trans.dataValues.total_price,
      });
      console.log(renderedTemplate);

      mailer({
        to: user.dataValues.email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

      res.status(200).send("transaction approved");
    } catch (err) {
      res.status(400).send(err.toString);
    }
  },
  rejectPayment: async (req, res) => {
    const id = req.params.id;
    try {
      await Transaction.update(
        {
          status: "reject transaction",
        },
        {
          where: { id },
        }
      );

      res.status(200).send("transaction rejected");
    } catch (err) {
      res.status(400).send(err.toString);
    }
  },
};

module.exports = eventController;
