const signinRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

signinRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

module.exports = signinRouter;
