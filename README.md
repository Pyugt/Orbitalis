# Orbitalis

> An immersive, real-time 3D Solar System simulator — explore all eight planets with physics-based orbits, live data, and a cinematic starfield

[![Live Demo](https://img.shields.io/badge/Live%20Demo-orbitalis--sv.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://orbitalis-sv.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r3f-black?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%E2%89%A514-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

---

##  Live Demo

**[→ orbitalis-sv.vercel.app](https://orbitalis-sv.vercel.app/)**

---

##  Features

###  3D Simulation
- All **8 planets** orbiting the Sun with physics-based circular orbit math
- **Frame-rate independent animation** via delta time — consistent at 30fps, 60fps, or 144fps
- **Saturn's rings** rendered as transparent ring geometry
- **6,000-star procedural starfield** background

###  Interactive Controls
- **Adjustable simulation speed** — 0.1× slow-motion to 10× fast-forward
- **Pause / Play** — freeze time at any moment
- **Orbit, zoom, and pan** with mouse or touch (via OrbitControls)
- **Reset camera** — one click back to default top-down view
- **Click any planet** to open a slide-in info panel with live API data

###  UI & UX
- **Toggleable planet labels** with occlusion behind objects
- **Toggleable orbit rings** for all planets
- **Glassmorphism dark UI** with blur and border glow
- **Live/offline API badge** in the header
- **Responsive** — works on desktop and tablet

###  Backend
- **REST API** with clean, validated endpoints
- **PostgreSQL + Prisma ORM** — type-safe migrations and queries
- **Seed data** — all 8 planets pre-loaded with accurate relative data
- **Helmet + CORS** security headers with configurable origins
- **Input validation** via `express-validator` on all routes
- **Centralized error handling** with environment-sensitive stack traces

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| 3D rendering | Three.js via `@react-three/fiber` |
| 3D helpers | `@react-three/drei` (OrbitControls, Html, Stars) |
| Styling | Tailwind CSS |
| State management | Zustand |
| HTTP client | Axios |
| Backend framework | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | express-validator |

---

##  Project Structure

```
orbitalis/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (Planet, User, SavedSimulation)
│   └── src/
│       ├── controllers/           # Thin route handlers
│       ├── services/              # Business logic & Prisma queries
│       ├── routes/                # Express routers
│       ├── middleware/            # Error handler, 404, validator
│       ├── prisma/seed.js         # Database seeder
│       ├── app.js                 # Express app factory
│       └── index.js               # Entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── SolarSystem.jsx    # Three.js canvas + planet/sun/orbit meshes
        │   ├── ControlPanel.jsx   # Speed, toggles, pause, camera reset
        │   ├── PlanetInfoPanel.jsx# Slide-in panel for selected planet
        │   └── Header.jsx         # Logo + live/offline badge
        ├── store/useStore.js      # Zustand global state
        ├── hooks/usePlanets.js    # API fetch hook
        └── utils/
            ├── api.js             # Axios instance + endpoint helpers
            └── planetData.js      # Static color/fallback constants
```

---

##  Quick Start

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm or pnpm

### 1. Clone

```bash
git clone https://github.com/Pyugt/orbitalis.git
cd orbitalis
```

### 2. Backend

```bash
cd backend
npm install

cp .env.example .env
# Set DATABASE_URL in .env

npx prisma migrate dev --name init   # Create tables
npm run prisma:seed                  # Seed all 8 planets
npm run dev                          # Start on http://localhost:4000
```

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev                          # Start on http://localhost:5173
```

---

##  API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/planets` | Get all 8 planets |
| `GET` | `/api/planets/:id` | Get a planet by ID |
| `POST` | `/api/simulations` | Save a simulation state |
| `GET` | `/api/simulations/:userId` | Get saved simulations for a user |
| `GET` | `/health` | Health check |

**Example — `GET /api/planets`**

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "name": "Mercury",
      "radius": 0.38,
      "orbitRadius": 8,
      "orbitalSpeed": 0.0948,
      "description": "Closest planet to the Sun...",
      "color": "#b5b5b5",
      "moons": 0,
      "mass": 0.055
    }
  ]
}
```

---

##  Environment Variables

**`backend/.env`**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/orbitalis"
ALLOWED_ORIGINS=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🔭 Physics Notes

Planets follow circular orbits using the formula:

```
angle += delta × orbitalSpeed × speedMultiplier
x = cos(angle) × orbitRadius
z = sin(angle) × orbitRadius
y = 0  (flat ecliptic plane)
```

Delta time (seconds since last frame) keeps orbits perfectly frame-rate independent — the simulation runs identically at any refresh rate.

---

##  Roadmap

- [ ] **Texture maps** — Real planetary textures from NASA public domain
- [ ] **Moons** — Orbital satellites (Earth's Moon, Jupiter's Galilean moons)
- [ ] **Asteroid belt** — Particle system between Mars and Jupiter
- [ ] **Elliptical orbits** — True Keplerian elements with orbital eccentricity
- [ ] **Date picker** — Travel to a specific date and see real planetary positions
- [ ] **User auth** — JWT-based login to save and share simulation states
- [ ] **Planet comparison** — Side-by-side stats panel for two selected planets
- [ ] **Search** — Jump the camera to any planet by name
- [ ] **VR mode** — WebXR support for immersive exploration

---

##  Contributing

Contributions are welcome! Feel free to open an issue to discuss ideas or submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push and open a pull request

