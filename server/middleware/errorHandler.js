const errorHandler = (err, req, res, next) => {
  console.error('[Server Error]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
};

module.exports = errorHandler;
