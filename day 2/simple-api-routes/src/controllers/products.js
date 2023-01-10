const { products } = require("../database/db.json");

const productsController = {
  getProducts: (req, res) => {
    res.status(200).json({
      message: "products data fetched",
      result: products,
    });
  },
  addProduct: (req, res) => {
    //logic isi disini
  },
};

module.exports = productsController;
