const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/notFoundError');

const { requestLogger, errorLogger } = require('./middlewares/logger'); // логгеры

const { PORT = 3000, BASE_PATH = 'localhost' } = process.env;

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://api.films.nomoredomainsrocks.ru', 'https://films.nomoredomainsrocks.ru'], // источник домена (откуда запрос)
  credentials: true, // обмен учетными данными
};

app.use(cors(corsOptions)); // доступ для других доменов

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
  legacyHeaders: false, // X-RateLimit-* headers
  // store: ... , // Use an external store for more precise rate limiting
});

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('База данных подключена.'))
  .catch((err) => console.log('DB error', err));

// логгер запросов
app.use(requestLogger);

app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Путь не найден'));
});

// логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер подключен — http://${BASE_PATH}:${PORT}`);
});
