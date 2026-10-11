class AppError extends Error {
  constructor(message, status = 500, code = 'SERVER_ERROR', details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
module.exports = AppError;
