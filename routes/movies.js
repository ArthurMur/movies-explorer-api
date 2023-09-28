const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

// возвращает все фильмы
movieRouter.get('/', auth, getMovies);
// создает фильм по _id
movieRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(URL_REGEX),
      trailerLink: Joi.string().required().regex(URL_REGEX),
      thumbnail: Joi.string().required().regex(URL_REGEX),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  auth,
  createMovie,
);
// удаляет фильм
movieRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  auth,
  deleteMovie,
);

module.exports = movieRouter;
