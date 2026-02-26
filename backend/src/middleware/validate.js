const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results and return errors if any.
 * Place after validation chains in route definitions.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
    });
  }

  next();
}

module.exports = validate;
