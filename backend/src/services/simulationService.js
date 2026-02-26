const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new saved simulation record.
 * @param {Object} data - Simulation state data from the request body
 */
async function createSimulation(data) {
  const { userId, name, speed, paused, showLabels, showOrbits, cameraState } = data;

  return prisma.savedSimulation.create({
    data: {
      userId,
      name,
      speed,
      paused: paused ?? false,
      showLabels: showLabels ?? true,
      showOrbits: showOrbits ?? true,
      cameraState: cameraState ?? {},
    },
    include: {
      user: { select: { id: true, username: true } },
    },
  });
}

/**
 * Retrieves all saved simulations for a specific user, sorted newest first.
 * @param {number} userId
 */
async function getSimulationsByUser(userId) {
  return prisma.savedSimulation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { createSimulation, getSimulationsByUser };
