const express = require('express');
const { body, param } = require('express-validator');
const simulationController = require('../controllers/simulationController');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/simulations - Save a new simulation state
router.post(
  '/',
  [
    body('userId').isInt({ min: 1 }).withMessage('userId must be a positive integer'),
    body('name').trim().notEmpty().withMessage('Simulation name is required').isLength({ max: 100 }),
    body('speed').isFloat({ min: 0.1, max: 100 }).withMessage('Speed must be between 0.1 and 100'),
    body('paused').optional().isBoolean(),
    body('showLabels').optional().isBoolean(),
    body('showOrbits').optional().isBoolean(),
    body('cameraState').optional().isObject(),
  ],
  validate,
  simulationController.createSimulation
);

// GET /api/simulations/:userId - Get all saved simulations for a user
router.get(
  '/:userId',
  [param('userId').isInt({ min: 1 }).withMessage('userId must be a positive integer')],
  validate,
  simulationController.getSimulationsByUser
);

module.exports = router;
