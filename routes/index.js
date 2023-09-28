const helmet = require('helmet');
const appRouter = require('express').Router();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('../utils/limiterConfig');
const userRouter = require('./users');
const movieRouter = require('./movies');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const errorHandler = require('../middlewares/error-handler');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');

const { requestLogger, errorLogger } = require('../middlewares/logger'); // логгеры

const corsOptions = {
  origin: ['http://localhost:3000', 'https://api.films.nomoredomainsrocks.ru', 'https://films.nomoredomainsrocks.ru'], // источник домена (откуда запрос)
  credentials: true, // обмен учетными данными
};

appRouter.use(cors(corsOptions)); // доступ для других доменов

appRouter.use(helmet());

appRouter.use(limiter);

appRouter.use(bodyParser.json());
appRouter.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
appRouter.use(requestLogger);

appRouter.use('/users', userRouter);
appRouter.use('/movies', movieRouter);
appRouter.use('/signup', signupRouter);
appRouter.use('/signin', signinRouter);

appRouter.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

// логгер ошибок
appRouter.use(errorLogger);

appRouter.use(errors());
appRouter.use(errorHandler);
