const db = require("../models");
const Event = db.event;
const User = db.user;

const Transaction = db.transaction;

const { Op } = require("sequelize");
const { nanoid } = require("nanoid");
const { sequelize } = require("../models");
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

    await Event.update(
      {
        total_ticket: event.total_ticket - qty,
      },
      {
        where: {
          id: event_id,
        },
      }
    );
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
};

module.exports = eventController;
