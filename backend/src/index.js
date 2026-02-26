/**
 * Orbitalis Backend - Entry Point
 * Starts the Express server and connects to PostgreSQL via Prisma.
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n🌌 Orbitalis API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
