-- CreateTable: planets
CREATE TABLE "planets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "orbitRadius" DOUBLE PRECISION NOT NULL,
    "orbitalSpeed" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "textureUrl" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "mass" DOUBLE PRECISION,
    "moons" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);

-- CreateTable: users
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable: saved_simulations
CREATE TABLE "saved_simulations" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "showLabels" BOOLEAN NOT NULL DEFAULT true,
    "showOrbits" BOOLEAN NOT NULL DEFAULT true,
    "cameraState" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique planet name
CREATE UNIQUE INDEX "planets_name_key" ON "planets"("name");

-- CreateIndex: unique user fields
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey: simulations → users
ALTER TABLE "saved_simulations" ADD CONSTRAINT "saved_simulations_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
