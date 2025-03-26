const config = require('config');
const ErrorResponse = require('../utils/errorResponse');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console
  if (config.get('app.env') === 'development') {
    console.error(`Error Stack: ${err.stack}`);
  } else {
    console.error(`Error: ${err.message}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = ErrorResponse.notFound(message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = ErrorResponse.conflict(message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = ErrorResponse.validationError('Validation error', message);
  }

  // JWT authentication error
  if (err.name === 'JsonWebTokenError') {
    error = ErrorResponse.unauthorized('Invalid token');
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    error = ErrorResponse.unauthorized('Token expired');
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    error: error.message || 'Server Error'
  };

  // Include error details in development environment
  if (config.get('app.env') === 'development' && statusCode === 500) {
    response.stack = err.stack;
  }

  // Include validation errors if present
  if (error.errors) {
    response.errors = error.errors;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;