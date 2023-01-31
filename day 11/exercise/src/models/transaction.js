"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init(
    {
      transaction_number: DataTypes.STRING,
      total_price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      payment_url: DataTypes.STRING,
      status: DataTypes.STRING,

      // event_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
