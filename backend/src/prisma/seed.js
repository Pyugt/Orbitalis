/**
 * Seed script: populates the database with the 8 planets of the Solar System.
 * Run with: npm run prisma:seed
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const planets = [
  {
    name: 'Mercury',
    radius: 0.38,
    orbitRadius: 8,
    orbitalSpeed: 0.0474 * 2, // scaled for visual interest
    description:
      'The smallest planet in the Solar System and the closest to the Sun. Mercury has no atmosphere, causing extreme temperature swings between day and night.',
    textureUrl: '/textures/mercury.jpg',
    color: '#b5b5b5',
    mass: 0.055,
    moons: 0,
  },
  {
    name: 'Venus',
    radius: 0.95,
    orbitRadius: 13,
    orbitalSpeed: 0.0350 * 2,
    description:
      'The hottest planet in our Solar System due to its thick CO₂ atmosphere creating a runaway greenhouse effect. Venus rotates backwards compared to most planets.',
    textureUrl: '/textures/venus.jpg',
    color: '#e8cda0',
    mass: 0.815,
    moons: 0,
  },
  {
    name: 'Earth',
    radius: 1.0,
    orbitRadius: 18,
    orbitalSpeed: 0.0298 * 2,
    description:
      'Our home planet — the only known world to harbor life. Earth has a protective magnetic field, liquid water oceans, and a stable atmosphere rich in nitrogen and oxygen.',
    textureUrl: '/textures/earth.jpg',
    color: '#4fa3e0',
    mass: 1.0,
    moons: 1,
  },
  {
    name: 'Mars',
    radius: 0.53,
    orbitRadius: 24,
    orbitalSpeed: 0.0241 * 2,
    description:
      'The Red Planet features the largest volcano in the Solar System (Olympus Mons) and evidence of ancient water. Mars is a prime target for future human exploration.',
    textureUrl: '/textures/mars.jpg',
    color: '#c1440e',
    mass: 0.107,
    moons: 2,
  },
  {
    name: 'Jupiter',
    radius: 2.8,
    orbitRadius: 38,
    orbitalSpeed: 0.0131 * 2,
    description:
      'The largest planet in our Solar System, a gas giant with a mass more than twice that of all other planets combined. Its Great Red Spot is a storm larger than Earth.',
    textureUrl: '/textures/jupiter.jpg',
    color: '#c88b3a',
    mass: 317.8,
    moons: 95,
  },
  {
    name: 'Saturn',
    radius: 2.3,
    orbitRadius: 52,
    orbitalSpeed: 0.0097 * 2,
    description:
      'Famous for its stunning ring system made of ice and rock. Saturn is a gas giant less dense than water, and has 146 known moons including Titan with its thick atmosphere.',
    textureUrl: '/textures/saturn.jpg',
    color: '#e4d191',
    mass: 95.2,
    moons: 146,
  },
  {
    name: 'Uranus',
    radius: 1.8,
    orbitRadius: 66,
    orbitalSpeed: 0.0068 * 2,
    description:
      'An ice giant that rotates on its side with an axial tilt of 98°. Uranus has faint rings and a pale blue-green color from methane in its atmosphere.',
    textureUrl: '/textures/uranus.jpg',
    color: '#7de8e8',
    mass: 14.5,
    moons: 28,
  },
  {
    name: 'Neptune',
    radius: 1.7,
    orbitRadius: 80,
    orbitalSpeed: 0.0054 * 2,
    description:
      'The windiest planet in the Solar System, with gusts reaching 2,100 km/h. Neptune is an ice giant with a striking deep blue color and the largest moon Triton orbits it backwards.',
    textureUrl: '/textures/neptune.jpg',
    color: '#3f54ba',
    mass: 17.1,
    moons: 16,
  },
];

async function main() {
  console.log('🌍 Seeding Orbitalis database...');

  // Clear existing planet data
  await prisma.planet.deleteMany();

  for (const planet of planets) {
    const created = await prisma.planet.create({ data: planet });
    console.log(`  ✅ Created: ${created.name}`);
  }

  console.log('\n🚀 Seed complete! All 8 planets inserted.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
