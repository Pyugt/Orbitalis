const planetService = require('../services/planetService');

/**
 * GET /api/planets
 * Returns all 8 planets with their orbital and display data.
 */
async function getAllPlanets(req, res, next) {
  try {
    const planets = await planetService.getAllPlanets();
    res.json({ success: true, count: planets.length, data: planets });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/planets/:id
 * Returns a single planet by its numeric ID.
 */
async function getPlanetById(req, res, next) {
  try {
    const planet = await planetService.getPlanetById(Number(req.params.id));

    if (!planet) {
      return res.status(404).json({ success: false, message: 'Planet not found' });
    }

    res.json({ success: true, data: planet });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllPlanets, getPlanetById };
