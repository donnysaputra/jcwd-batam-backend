const { category } = require("../models");
const db = require("../models");
const Movies = db.movies;
const Categories = db.category;
const Movies_Category = db.movies_category;

const Category = require("../models/category");
// const Movie = require("../models/category");

const moviesController = {
  getMovies: async (req, res) => {
    const data = await Movies.findAll({
      include: [
        {
          model: Categories,
        },
      ],
    });
    res.send(data);
  },
  getCategories: async (req, res) => {
    const data = await Category.findAll();
    res.send(data);
  },
  addMovie: async (req, res) => {
    console.log(req.body);
    const movieData = {
      img_url: req.body.img_url,
      match: req.body.match,
      synopsis: req.body.synopsis,
      title: req.body.title,
      year: req.body.year,
    };

    const data = await Movies.create(movieData);

    console.log(data.id);
    //categories = [ {category.id, category.category, etc }]

    req.body.Categories.map(async (val) => {
      const movieCat = {
        MovieId: data.id,
        CategoryId: val.id,
      };
      await Movies_Category.create(movieCat);
    });

    res.end();
  },
  editMovie: async (req, res) => {
    const id = req.params.id;

    console.log(req.body);

    const movieData = {
      img_url: req.body.img_url,
      match: req.body.match,
      synopsis: req.body.synopsis,
      title: req.body.title,
      year: req.body.year,
    };

    const data = await Movies.update(movieData, {
      where: {
        id: id,
      },
    });
    console.log(data.id);

    await Movies_Category.destroy({
      where: {
        Movieid: id,
      },
    });

    req.body.Categories.map(async (val) => {
      const movieCat = {
        MovieId: id,
        CategoryId: val.id,
      };
      await Movies_Category.create(movieCat);
    });
    res.end();
  },
  deleteMovie: async (req, res) => {
    const id = req.params.id;
    Movies.destroy({
      where: {
        id: id,
      },
    });
    res.end();
  },
};

module.exports = moviesController;
