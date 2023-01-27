// const db = require("../database/config");
const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const mailer = require("../lib/mailer");
const mustache = require("mustache");
const fs = require("fs");

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

      // console.log(ifUserExist.dataValues);

      if (ifUserExist) {
        throw new Error({
          message: "this email already registered",
        });

        // return res.status(400).json({
        //   message: "this email already registered",
        // });
      }

      const result = await User.create({ ...req.body });
      await t.commit;

      return res.status(201).json({
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
      const { email, password, username, name } = req.body;
      //cek email
      const isExist = await User.findOne({
        where: {
          [Op.or]: [
            {
              username: username,
            },
            {
              email: email,
            },
          ],
        },
      });

      // console.log(isExist);

      if (isExist) {
        return res.status(400).json({
          message: "this email is already registered",
        });
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const data = {
        username,
        email,
        password: hashPassword,
        name,
        verified: false,
      };

      const result = await User.create({ ...data });
      delete result.dataValues.password;

      const token = await jwt.sign(
        { ...result.dataValues },
        process.env.secret,
        {
          expiresIn: "5m",
        }
      );

      const template = fs
        .readFileSync(__dirname + "/../templates/verify.html")
        .toString();

      const renderedTemplate = mustache.render(template, {
        username,
        verify_url: process.env.verificationLink + token,
        full_name: name,
      });

      await mailer({
        to: email,
        subject: "Verify your account!",
        html: renderedTemplate,
      });

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
        const token = jwt.sign({ id: user.dataValues.id }, process.env.secret, {
          expiresIn: "2h",
        });

        return res.status(200).json({
          message: "user successfully logged in",
          result: { token, user },
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
    try {
      let token = req.headers.authorization;
      // token = token.split(" ")[1];
      const oldUser = await jwt.verify(token, process.env.secret);
      const newUser = await User.findByPk(oldUser.id);

      delete newUser.dataValues.avatar_buffer;
      delete newUser.dataValues.password;

      return res.status(400).json({
        message: "keep login fetched",
        result: newUser,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      const id = req.params.id;
      const { username, name, description } = req.body;
      const data = { username, name, description };

      if (req.file) {
        const pic = await sharp(req.file.buffer)
          .resize(250, 250)
          .png()
          .toBuffer();

        data.avatar_url = process.env.render_avatar + id;
        data.avatar_buffer = pic;
      }

      await User.update(
        {
          ...data,
        },
        {
          where: {
            id,
          },
        }
      );

      const result = await User.findByPk(id);
      delete result.dataValues.password;
      delete result.dataValues.avatar_buffer;

      return res.status(200).json({
        message: "user edited",
        result,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  renderAvatar: async (req, res) => {
    try {
      const id = req.params.id; //27
      const avatar = await User.findOne({
        where: {
          id,
        },
      });
      console.log(avatar.id);

      res.set("Content-type", "image/png");

      res.send(avatar.avatar_buffer);
    } catch (err) {
      res.send(err);
    }
  },
  verifiedUser: async (req, res) => {
    try {
      const token = req.params.token;
      const data = await jwt.verify(token, process.env.secret);
      console.log(data);
      await User.update(
        {
          verified: true,
        },
        {
          where: {
            id: data.id,
          },
        }
      );
      return res.status(400).json({
        message: "verified",
      });
    } catch (err) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },
  resendEmail: async (req, res) => {
    // const href = "www.facebook.com";
    const id = req.params.id;
    console.log(id);
    const user = await User.findByPk(id);
    const template = fs
      .readFileSync(__dirname + "/../templates/verify.html")
      .toString();

    const token = await jwt.sign({ id }, process.env.secret, {
      expiresIn: "3m",
    });

    const renderedTemplate = mustache.render(template, {
      username: user.dataValues.username,
      verify_url: process.env.verificationLink + token,
      full_name: user.dataValues.name,
    });

    await mailer({
      to: user.dataValues.email,
      subject: "Verify your account!",
      html: renderedTemplate,
    });
    res.send("email sent");
  },
};
module.exports = authController;
