/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret2', NODE_ENV } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/constants');

// классы с ответами об ошибках
const RequestError = require('../errors/requestError'); // 400
const NotFoundError = require('../errors/notFoundError'); // 404
const EmailExistenceError = require('../errors/emailExistenceError'); // 409

// возвращает информацию о текущем пользователе
const getMe = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(...user);
    })
    .catch(next);
};

// Создание пользователя (Регистрация)
const registerUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })).then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        _id: user._id,
      });
    }).catch((err) => {
      if (err.code === 11000) {
        next(new EmailExistenceError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        return next(new RequestError('Переданы некорректные данные пользователя'));
      } else {
        return next(err);
      }
    });
};

// Обновление профиля пользователя
const updateUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((updatedData) => {
      if (updatedData === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(updatedData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные пользователя'));
      } else if (err.code === 11000) {
        next(new EmailExistenceError('Пользователь с таким email уже существует'));
      } else {
        return next(err);
      }
    });
};

// Проверка почты и пароля
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY,
        { expiresIn: '7d' },
      );
      res.send({ message: 'Успешная аутентификация', token });
    })
    .catch(next);
};

module.exports = {
  getMe,
  registerUser,
  updateUserData,
  login,
};
