const { sequelize, Sequelize } = require(".");

// const { DataTypes } = Sequelize;

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return User;
};
