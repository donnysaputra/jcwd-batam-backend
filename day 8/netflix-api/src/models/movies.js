"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Movies.init(
    {
      title: DataTypes.STRING,
      match: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      synopsis: DataTypes.STRING,
      img_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Movies",
    }
  );
  // Cart.associate = (models) => {
  //   Cart.belongsTo(models.user, { foreignKey: 'userId' });
  //   Cart.belongsTo(models.product, { foreignKey: 'productId' });
  // };
  // Movies.associate = (models) => {
  //   Movies.belongsTo(models.category, { foreignKey: ''})
  // }
  return Movies;
};
