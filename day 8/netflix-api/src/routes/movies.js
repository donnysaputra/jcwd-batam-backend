const express = require("express");
const router = express.Router();
const moviesController = require("../controllers/movies");
router.get("/", moviesController.getMovies);

router.get("/categories", moviesController.getCategories);
router.post("/", moviesController.addMovie);
router.patch("/:id", moviesController.editMovie);
router.delete("/:id", moviesController.deleteMovie);

module.exports = router;
