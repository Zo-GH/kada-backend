// Error handler middleware
const errorHandler = (err, req, res, next) => {
    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
  
    // Validation errors (e.g., from Joi or Mongoose validation)
    if (err.name === 'ValidationError') {
      statusCode = 400;
      const validationErrors = Object.values(err.errors).map((val) => val.message);
      message = validationErrors.length ? validationErrors : 'Invalid input data';
    }
  
    // Mongoose "CastError" for invalid ObjectId formats
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
  
    // JWT Token Errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
  
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
  
    // Duplicate key error (e.g., when a unique field like email already exists)
    if (err.code && err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue)[0];
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }
  
    // Authorization errors
    if (err.message === 'Unauthorized') {
      statusCode = 403;
      message = 'You are not authorized to access this resource';
    }
  
    // Send formatted error response
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  // Export the error handler middleware
  module.exports = errorHandler;
  