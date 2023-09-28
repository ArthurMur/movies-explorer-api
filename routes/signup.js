const signupRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { registerUser } = require('../controllers/users');

signupRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), registerUser);

module.exports = signupRouter;
