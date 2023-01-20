const db = require("../models");
const Users = db.user;
const Suspend_User = db.suspend_user;

const { Op } = require("sequelize");
const usersController = {
  register: async (req, res) => {
    const { email, password, c_password, username, phone_number, name } =
      req.body;

    const check = await Users.findAll({
      where: {
        [Op.or]: [
          {
            email: email,
          },
          {
            username: username,
          },
        ],
      },
    });

    if (check.length) {
      return res.status(400).json({
        message: "email/username sudah terdaftar",
      });
    }

    console.log(password.length);
    if (password != c_password || password.length < 9) {
      return res.status(400).json({
        message: "password tidak sesuai",
      });
    }

    const result = await Users.create({ ...req.body });
    return res.status(400).json({
      message: "data berhasil ditambahkan",
      result: result,
    });
  },
  login: async (req, res) => {
    const { password, user_phone_mail } = req.body;
    const newDate = new Date();

    const result = await Users.findOne({
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

    console.log(newDate);
    if (result.login_attempt >= 3) {
      const _3minutes = new Date();

      _3minutes.setMinutes(_3minutes.getMinutes() + 3);

      await Suspend_User.create({
        suspend_until: _3minutes,
        user_id: result.id,
      });

      await Users.update(
        {
          login_attempt: 0,
        },
        {
          where: {
            id: result.id,
          },
        }
      );
    }

    const check_suspend = await Suspend_User.findOne({
      where: {
        user_id: result.id,
      },
      order: [["id", "DESC"]],
    });

    if (check_suspend) {
      if (check_suspend?.suspend_until > newDate) {
        const sisa_menit =
          check_suspend.suspend_until.getMinutes() - newDate.getMinutes();

        return res.status(400).json({
          message: `anda terkena suspend tidak bisa login hingga ${sisa_menit} menit `,
        });
      }
    }
    if (result.password != password) {
      console.log("Test");
      await Users.update(
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

    console.log(result.password);
    console.log(password);

    return res.status(200).json({
      message: "login",
      result: result,
    });
  },
  editProfile: async (req, res) => {
    try {
      const id = req.params.id;
      let data = {
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        occupation: req.body.occupation,
        currency_id: req.body.currency_id,
      };
      data = Object.entries(data);

      let newData = [];
      data.map((val) => {
        if (val[1]) {
          newData.push(val);
        }
      });

      newData = Object.fromEntries(newData);
      console.log(newData);

      if (Object.entries(newData).length) {
        const result = await Users.update(
          { ...newData },
          {
            where: {
              id: id,
            },
          }
        );
        console.log(result);
      }

      res.send(result);
    } catch (err) {
      res.send(err);
    }
  },
};

module.exports = usersController;
