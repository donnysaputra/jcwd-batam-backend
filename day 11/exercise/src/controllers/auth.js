// const db = require("../database/config");
const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = {
  register: async (req, res) => {
    const {
      email,
      password,
      username,
      isAdmin,
      password_confirmation,
      phone_number,
    } = req.body;

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

    console.log(isExist);

    if (password.length < 9) {
      return res.status(400).json({
        message: "password less than 8 digits",
      });
    }

    if (isExist) {
      return res.status(400).json({
        message: "this email/username is already registered",
      });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({
        message: "password doesnt match the confirmation password",
      });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    const data = {
      username: username,
      email: email,
      isAdmin: isAdmin,
      password: hashPassword,
      phone_number: phone_number,
    };

    const result = await User.create({ ...data });

    res.status(200).json({
      message: "new user has been created",
      result: result,
    });
  },
  // login: async (req, res) => {
  //   try {
  //     const { username, password } = req.body;

  //     const user = await User.findOne({
  //       where: {
  //         [Op.and]: [
  //           {
  //             username: username,
  //           },
  //         ],
  //       },
  //     });

  //     const checkPass = await bcrypt.compareSync(password, user.password);
  //     delete user.dataValues.password;

  //     if (checkPass) {
  //       const token = jwt.sign({ ...user.dataValues }, "secret", {
  //         expiresIn: "1m",
  //       });
  //       const tk = jwt.verify(token, "secret");
  //       console.log(tk);

  //       return res.status(200).json({
  //         message: "user successfully logged in",
  //         result: token,
  //       });
  //     }
  //     return res.status(400).json({
  //       message: "user failed logged in",
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(400).json({
  //       message: err,
  //     });
  //   }
  // },
  login: async (req, res) => {
    const { password, user_phone_mail } = req.body;
    const newDate = new Date();
    console.log(newDate);
    const result = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: user_phone_mail,
          },
          {
            phone_number: user_phone_mail,
          },
          {
            email: user_phone_mail,
          },
        ],
      },
    });
    if (!result) {
      return res.status(400).json({
        message: `user not found`,
      });
    } else {
      console.log(result.login_attempt);
      if (result.login_attempt >= 2) {
        const _3minutes = new Date();

        _3minutes.setMinutes(_3minutes.getMinutes() + 3);
        result.suspend_until = _3minutes;

        await User.update(
          {
            login_attempt: 0,
            suspend_until: _3minutes,
          },
          {
            where: {
              id: result.id,
            },
          }
        );
      }

      if (result.suspend_until > newDate) {
        const sisa_menit =
          result.suspend_until.getMinutes() - newDate.getMinutes();

        return res.status(400).json({
          message: `anda terkena suspend tidak bisa login hingga ${sisa_menit} menit `,
        });
      }
      const check = await bcrypt.compare(password, result.password);
      console.log(check);
      if (!check) {
        await User.update(
          {
            login_attempt: result.login_attempt + 1,
          },
          {
            where: {
              id: result.id,
            },
          }
        );

        return res.status(400).json({
          message:
            "gagal login password salah " +
            Number(result.login_attempt + 1) +
            " kali",
        });
      }
    }

    return res.status(200).json({
      message: "login success",
      result: result,
    });
  },
  loginAdmin: async (req, res) => {
    const { password, user_phone_mail } = req.body;
    const newDate = new Date();
    console.log(newDate);
    const result = await User.findOne({
      where: {
        isAdmin: true,
        [Op.or]: [
          {
            username: user_phone_mail,
          },
          {
            phone_number: user_phone_mail,
          },
          {
            email: user_phone_mail,
          },
        ],
      },
    });
    if (!result) {
      return res.status(400).json({
        message: `user not found`,
      });
    } else {
      console.log(result.login_attempt);
      if (result.login_attempt >= 2) {
        const _3minutes = new Date();

        _3minutes.setMinutes(_3minutes.getMinutes() + 3);
        result.suspend_until = _3minutes;

        await User.update(
          {
            login_attempt: 0,
            suspend_until: _3minutes,
          },
          {
            where: {
              id: result.id,
            },
          }
        );
      }

      if (result.suspend_until > newDate) {
        const sisa_menit =
          result.suspend_until.getMinutes() - newDate.getMinutes();

        return res.status(400).json({
          message: `anda terkena suspend tidak bisa login hingga ${sisa_menit} menit `,
        });
      }
      const check = await bcrypt.compare(password, result.password);
      console.log(check);
      if (!check) {
        await User.update(
          {
            login_attempt: result.login_attempt + 1,
          },
          {
            where: {
              id: result.id,
            },
          }
        );

        return res.status(400).json({
          message:
            "gagal login password salah " +
            Number(result.login_attempt + 1) +
            " kali",
        });
      }
    }

    return res.status(200).json({
      message: "login success",
      result: result,
    });
  },
};
module.exports = authController;
