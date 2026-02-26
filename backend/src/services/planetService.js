const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Fetches all planets ordered by their orbit radius (innermost first).
 */
async function getAllPlanets() {
  return prisma.planet.findMany({
    orderBy: { orbitRadius: 'asc' },
  });
}

/**
 * Fetches a single planet by its primary key.
 * @param {number} id - Planet ID
 */
async function getPlanetById(id) {
  return prisma.planet.findUnique({
    where: { id },
  });
}

module.exports = { getAllPlanets, getPlanetById };
