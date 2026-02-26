const simulationService = require('../services/simulationService');

/**
 * POST /api/simulations
 * Saves a snapshot of the current simulation state for a user.
 */
async function createSimulation(req, res, next) {
  try {
    const simulation = await simulationService.createSimulation(req.body);
    res.status(201).json({ success: true, data: simulation });
  } catch (err) {
    // Handle foreign key violation (user not found)
    if (err.code === 'P2003') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    next(err);
  }
}

/**
 * GET /api/simulations/:userId
 * Retrieves all saved simulations for a given user, newest first.
 */
async function getSimulationsByUser(req, res, next) {
  try {
    const simulations = await simulationService.getSimulationsByUser(Number(req.params.userId));
    res.json({ success: true, count: simulations.length, data: simulations });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSimulation, getSimulationsByUser };
