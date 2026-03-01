# 🌌 Orbitalis — Interactive 3D Solar System Visualizer

An immersive, real-time 3D Solar System simulation built with React, Three.js, Node.js and PostgreSQL.

![Orbitalis Preview](https://placehold.co/1200x600/050510/6366f1?text=Orbitalis+%E2%80%94+3D+Solar+System)

---

## ✨ Features

### Frontend
- **Real-time 3D simulation** — All 8 planets orbiting the Sun using physics-based circular orbit math.
- **Frame-rate independent animation** — Delta time ensures consistent speeds at any refresh rate
- **Adjustable simulation speed** — 0.1× slow-motion to 10× fast-forward
- **Pause / Play** — Freeze time at any moment
- **Camera controls** — Orbit, zoom, and pan with mouse/touch (powered by OrbitControls)
- **Reset camera** — One click returns to default top-down view
- **Planet labels** — Toggleable name overlays that occlude behind objects
- **Orbit rings** — Toggleable elliptical paths for each planet
- **Click-to-inspect** — Click any planet to open an info panel with live API data
- **Saturn's rings** — Rendered as a transparent ring geometry
- **Starfield background** — 6,000 procedurally-distributed stars
- **Glassmorphism UI** — Dark-themed panels with blur and border glow
- **Responsive layout** — Works on desktop and tablet

### Backend
- **REST API** — Clean, validated endpoints for planets and simulations
- **PostgreSQL + Prisma ORM** — Type-safe database access with schema migrations
- **Seed data** — All 8 planets pre-loaded with accurate relative data
- **Error handling** — Centralized error middleware with environment-sensitive stack traces
- **Input validation** — Via `express-validator` on all POST/parameterized routes
- **Helmet + CORS** — Security headers and configurable allowed origins

---

## 🗂 Project Structure

```
orbitalis/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # DB schema (Planet, User, SavedSimulation)
│   ├── src/
│   │   ├── controllers/           # Route handlers (thin layer)
│   │   │   ├── planetController.js
│   │   │   └── simulationController.js
│   │   ├── services/              # Business logic & Prisma queries
│   │   │   ├── planetService.js
│   │   │   └── simulationService.js
│   │   ├── routes/                # Express routers
│   │   │   ├── planetRoutes.js
│   │   │   └── simulationRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Global error handler
│   │   │   ├── notFound.js        # 404 handler
│   │   │   └── validate.js        # express-validator checker
│   │   ├── prisma/
│   │   │   └── seed.js            # Database seeder
│   │   ├── app.js                 # Express app factory
│   │   └── index.js               # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SolarSystem.jsx    # Three.js canvas + planet/sun/orbit meshes
    │   │   ├── ControlPanel.jsx   # Speed, toggles, pause, camera reset
    │   │   ├── PlanetInfoPanel.jsx# Slide-in panel for selected planet
    │   │   └── Header.jsx         # Logo + live/offline badge
    │   ├── store/
    │   │   └── useStore.js        # Zustand global state
    │   ├── hooks/
    │   │   └── usePlanets.js      # API fetch hook
    │   ├── utils/
    │   │   ├── api.js             # Axios instance + endpoint helpers
    │   │   └── planetData.js      # Static color/fallback constants
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm or pnpm

---

### 1. Clone the repository

```bash
git clone https://github.com/Pyugt/orbitalis.git
cd orbitalis
```

---

### 2. Backend setup

```bash
cd backend
npm install

# Copy and fill in environment variables
cp .env.example .env
# Edit .env — set your DATABASE_URL

# Run Prisma migrations (creates the tables)
npx prisma migrate dev --name init

# Seed the database with all 8 planets
npm run prisma:seed

# Start the dev server
npm run dev
```

The API will be available at `http://localhost:4000`.

---

### 3. Frontend setup

```bash
cd ../frontend
npm install

# Copy environment file (optional — Vite proxies API in dev)
cp .env.example .env

# Start the Vite dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/planets` | Get all 8 planets |
| GET | `/api/planets/:id` | Get a planet by ID |
| POST | `/api/simulations` | Save a simulation state |
| GET | `/api/simulations/:userId` | Get saved simulations for a user |
| GET | `/health` | Health check |

### Example response — `GET /api/planets`

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
      "textureUrl": "/textures/mercury.jpg",
      "color": "#b5b5b5",
      "moons": 0,
      "mass": 0.055
    }
    ...
  ]
}
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/orbitalis"
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🔭 Physics Notes

Planets follow **circular orbits** using the formula:

```
angle += delta * orbitalSpeed * speedMultiplier
x = cos(angle) * orbitRadius
z = sin(angle) * orbitRadius
y = 0  (flat ecliptic plane)
```

**Delta time** (seconds since last frame) ensures orbit speed is completely frame-rate independent — the simulation runs identically at 30fps, 60fps or 144fps.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| 3D rendering | Three.js via @react-three/fiber |
| 3D helpers | @react-three/drei (OrbitControls, Html, Stars) |
| Styling | Tailwind CSS |
| State management | Zustand |
| HTTP client | Axios |
| Backend framework | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | express-validator |

---

## 🔮 Future Improvements

- **Texture maps** — Load real planetary texture images (NASA public domain)
- **Moons** — Render orbital satellites (e.g., Earth's Moon, Jupiter's Galilean moons)
- **Asteroid belt** — Particle system between Mars and Jupiter
- **Elliptical orbits** — Use true Keplerian elements for eccentricity
- **Date picker** — Travel to a specific date and see real planetary positions
- **User auth** — JWT-based login to save and recall simulation states
- **VR mode** — WebXR support for immersive exploration
- **Planet comparison** — Side-by-side stats for two selected planets
- **Search** — Jump camera to a planet by name
