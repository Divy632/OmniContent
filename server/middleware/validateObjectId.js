const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

module.exports = (param = 'id') => (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params[param])) return next(new AppError('Not found.', 404, 'NOT_FOUND'));
  next();
};
