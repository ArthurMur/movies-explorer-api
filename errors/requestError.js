class RequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError ';
    this.statusCode = 400;
  }
}

module.exports = RequestError;
