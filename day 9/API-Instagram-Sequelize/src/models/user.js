"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      description: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      avatar_buffer: DataTypes.BLOB,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
