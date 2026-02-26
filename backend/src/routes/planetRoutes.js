const express = require('express');
const { param } = require('express-validator');
const planetController = require('../controllers/planetController');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/planets - Retrieve all planets
router.get('/', planetController.getAllPlanets);

// GET /api/planets/:id - Retrieve a single planet by ID
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Planet ID must be a positive integer')],
  validate,
  planetController.getPlanetById
);

module.exports = router;
