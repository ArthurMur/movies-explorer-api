const express = require('express');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

const {
  PORT = 3000, BASE_PATH = 'localhost', DB_CONNECTION, NODE_ENV,
} = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? DB_CONNECTION : 'mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('База данных подключена.'))
  .catch((err) => console.log('DB error', err));

app.use('/', appRouter);

app.listen(PORT, () => {
  console.log(`Сервер подключен — http://${BASE_PATH}:${PORT}`);
});
