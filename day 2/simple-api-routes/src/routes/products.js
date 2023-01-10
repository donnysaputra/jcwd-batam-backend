const express = require("express");
const router = express.Router();

const data = require("../database/db.json");
const { productsController } = require("../controllers");
const validateKeys = require("../middleware/validateKeys");

router.use(validateKeys);

//localhost:2000/products/

router.get("/", validateKeys, productsController.getProducts);
router.post("/", productsController.addProduct);

module.exports = router;
