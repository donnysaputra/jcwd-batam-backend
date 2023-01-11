const express = require("express");
const router = express.Router();

const { productsController } = require("../controllers");
const validateKeys = require("../middleware/validateKeys");

router.use(validateKeys);

//localhost:2000/products/

router.get("/", productsController.getProducts);
router.post("/", productsController.addProduct);
router.patch("/:id", productsController.editProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;
