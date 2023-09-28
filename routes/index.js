const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const appRouter = require('express').Router();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./users');
const movieRouter = require('./movies');
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const errorHandler = require('../middlewares/error-handler');
const NotFoundError = require('../errors/notFoundError');

const { requestLogger, errorLogger } = require('../middlewares/logger'); // логгеры

const corsOptions = {
  origin: ['http://localhost:3000', 'https://api.films.nomoredomainsrocks.ru', 'https://films.nomoredomainsrocks.ru'], // источник домена (откуда запрос)
  credentials: true, // обмен учетными данными
};

appRouter.use(cors(corsOptions)); // доступ для других доменов

appRouter.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
  // store: ... , // Use an external store for more precise rate limiting
});

appRouter.use(limiter);

appRouter.use(bodyParser.json());
appRouter.use(bodyParser.urlencoded({ extended: true }));

// логгер запросов
appRouter.use(requestLogger);

appRouter.use('/users', userRouter);
appRouter.use('/movies', movieRouter);
appRouter.use('/signup', signupRouter);
appRouter.use('/signin', signinRouter);

appRouter.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

// логгер ошибок
appRouter.use(errorLogger);

appRouter.use(errors());
appRouter.use(errorHandler);
