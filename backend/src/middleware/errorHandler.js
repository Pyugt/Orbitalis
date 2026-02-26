/**
 * Global error handling middleware.
 * Catches all errors thrown by route handlers and formats a consistent JSON response.
 */
function errorHandler(err, req, res, next) {
  // Log the error stack in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.error('\n❌ Error:', err.stack || err.message);
  } else {
    console.error(`❌ [${new Date().toISOString()}] ${err.message}`);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
