const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret2', NODE_ENV } = process.env;
const { MODE_PRODUCTION, DEV_KEY } = require('../utils/constants');

const AuthorizationError = require('../errors/authorizationError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Неправильные почта или пароль'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === MODE_PRODUCTION ? JWT_SECRET : DEV_KEY);
  } catch (err) {
    return next(new AuthorizationError('Неправильные почта или пароль', err));
  }
  req.user = payload;

  return next();
};
