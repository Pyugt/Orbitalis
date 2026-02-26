/**
 * 404 Not Found middleware.
 * Catches any request that didn't match a defined route.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

module.exports = notFound;
