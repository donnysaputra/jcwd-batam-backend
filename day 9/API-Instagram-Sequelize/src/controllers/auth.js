// const db = require("../database/config");
const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const result = await User.findOne({
        where: {
          [Op.and]: [
            {
              username: username,
            },
            {
              password: password,
            },
          ],
        },
      });

      if (result.username) {
        return res.status(200).json({
          message: "user successfully logged in",
          result: result,
        });
      }
      return res.status(400).json({
        message: "user failed logged in",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  register: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const ifUserExist = await User.findOne({
        where: {
          [Op.or]: [
            {
              email: req.body.email,
            },
            {
              username: req.body.username,
            },
          ],
        },
      });

      console.log(ifUserExist.dataValues);

      if (ifUserExist) {
        res.status(400).json({
          message: "this email already registered",
        });
      }

      const result = await User.create({ ...req.body });
      await t.commit;

      res.status(201).json({
        message: "new user registered",
        result: result,
      });
    } catch (err) {
      await t.rollback();

      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  getUserByUsername: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { username } = req.query;

      const result = await User.findOne({
        where: {
          username: username,
        },
      });

      return res.status(200).json({
        message: "fetched user",
        result: result,
      });
    } catch (err) {
      return res.status(400).json({
        message: "fetched user",
        result: result,
      });
    }

    //   const q = `select * from users where username = '${username}'`;
    //   console.log(username);
    //   db.query(q, (err, result) => {
    //     if (err) {
    //       return res.status(400).json({
    //         message: err,
    //       });
    //     }

    //   });
    // },
  },

  registerV2: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const data = req.body;

      data.password = bcrypt.hashSync(req.body.password, 10);
      console.log(data.password);
      const result = await User.create({ ...data });
      await t.commit;

      res.status(201).json({
        message: "new user registered",
        result: result,
      });
    } catch (err) {
      await t.rollback();

      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },

  loginV2: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        where: {
          [Op.and]: [
            {
              username: username,
            },
          ],
        },
      });

      const checkPass = await bcrypt.compareSync(password, user.password);
      delete user.dataValues.password;

      if (checkPass) {
        const token = jwt.sign({ ...user.dataValues }, "secret", {
          expiresIn: "1m",
        });
        const tk = jwt.verify(token, "secret");
        console.log(tk);

        return res.status(200).json({
          message: "user successfully logged in",
          result: token,
        });
      }
      return res.status(400).json({
        message: "user failed logged in",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    }
  },
  keeplogin: async (req, res) => {
    let token = req.headers.authorization;
    token = token.split(" ")[1];

    console.log(token);

    res.send(token);
  },
};
module.exports = authController;
