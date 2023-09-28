const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getMe,
  updateUserData,
} = require('../controllers/users');

// возвращает информацию о текущем пользователе
userRouter.get('/me', auth, getMe);
// обновляет профиль
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email({ tlds: { allow: false } }),
    }),
  }),
  auth,
  updateUserData,
);

module.exports = userRouter;
