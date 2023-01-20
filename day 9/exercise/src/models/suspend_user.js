"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class suspend_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  suspend_user.init(
    {
      suspend_until: { type: DataTypes.DATE, defaultValue: Date.now },
    },
    {
      sequelize,
      modelName: "suspend_user",
    }
  );
  return suspend_user;
};
