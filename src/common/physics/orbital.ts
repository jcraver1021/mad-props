import { Vec2D } from "../math/vec2d";

// Gravitational constant (simulation units). Tuned so that a planet at
// 180 px from a STAR_MASS star has an orbital period of ~20 sim-seconds.
export const G = 1.0;
export const STAR_MASS = 500_000;

// ── Types ────────────────────────────────────────────────────────────────────

export interface Star {
  mass: number;
  visualRadius: number;
  position: Vec2D;
  /** Display name (e.g. "Sun", "TRAPPIST-1"). */
  name?: string;
  /** Hex color used for glow/body gradient (e.g. "#FFD54F"). */
  color?: string;
}

export interface SimPlanet {
  id: string;
  name: string;
  mass: number;
  visualRadius: number;
  color: string;
  position: Vec2D;
  velocity: Vec2D;
  /** Cached acceleration — used by Velocity Verlet integrator. */
  acceleration: Vec2D;
  /** Whether to render a Saturn-like ring. */
  hasRing?: boolean;
}

export interface PlanetConfig {
  name: string;
  color: string;
  /** Periapsis distance from star in canvas pixels. */
  orbitalRadius: number;
  /** Visual / mass scale, 1–10. */
  size: number;
  /** 0 = circular, approaching 1 = highly elliptical. */
  eccentricity: number;
  /** Angle (radians) from the positive-x axis at which the planet starts. */
  startAngle: number;
  /** Whether to render a Saturn-like ring. */
  hasRing?: boolean;
}

// ── Gravity ──────────────────────────────────────────────────────────────────

/** Gravitational acceleration exerted on `bodyPos` by a point mass. */
export function gravAccel(
  bodyPos: Vec2D,
  attractorPos: Vec2D,
  attractorMass: number,
): Vec2D {
  const delta = attractorPos.sub(bodyPos);
  const distSq = delta.magnitudeSq();
  // Softening to avoid singularity when bodies overlap
  if (distSq < 25) return new Vec2D(0, 0);
  const mag = (G * attractorMass) / distSq;
  return delta.normalize().scale(mag);
}

/** Net acceleration on `planet` from the star and (optionally) other planets. */
export function computeAcceleration(
  planet: SimPlanet,
  star: Star,
  others: SimPlanet[],
  nBody: boolean,
): Vec2D {
  let acc = gravAccel(planet.position, star.position, star.mass);
  if (nBody) {
    for (const other of others) {
      if (other.id !== planet.id) {
        acc = acc.add(gravAccel(planet.position, other.position, other.mass));
      }
    }
  }
  return acc;
}

// ── Integrator ───────────────────────────────────────────────────────────────

/**
 * Advance the simulation by `dt` simulation-seconds using Velocity Verlet.
 * All planet positions are updated simultaneously (correct for n-body).
 */
export function stepSimulation(
  planets: SimPlanet[],
  star: Star,
  nBody: boolean,
  dt: number,
): SimPlanet[] {
  if (planets.length === 0) return planets;

  // 1. New positions: x(t+dt) = x + v·dt + ½a·dt²
  const newPositions = planets.map((p) =>
    p.position
      .add(p.velocity.scale(dt))
      .add(p.acceleration.scale(0.5 * dt * dt)),
  );

  // 2. New accelerations at new positions
  const tempPlanets = planets.map((p, i) => ({
    ...p,
    position: newPositions[i],
  }));
  const newAccels = tempPlanets.map((p) =>
    computeAcceleration(p, star, tempPlanets, nBody),
  );

  // 3. New velocities: v(t+dt) = v + ½(a + a_new)·dt
  return planets.map((p, i) => ({
    ...p,
    position: newPositions[i],
    velocity: p.velocity.add(p.acceleration.add(newAccels[i]).scale(0.5 * dt)),
    acceleration: newAccels[i],
  }));
}

// ── Planet factory ────────────────────────────────────────────────────────────

/**
 * Create a planet placed at its periapsis with the correct orbital velocity.
 *
 * The orbit is an ellipse whose periapsis is at `orbitalRadius` pixels from
 * the star, rotated so the periapsis is in the `startAngle` direction.
 *
 * Velocity direction is CCW in screen coordinates (y-axis points down).
 */
export function createPlanet(
  config: PlanetConfig,
  star: Star,
  id: string,
): SimPlanet {
  const {
    orbitalRadius: rp,
    eccentricity: e,
    startAngle,
    size,
    color,
    name,
  } = config;

  // Periapsis speed from vis-viva: v_p = √(G·M·(1+e)/r_p)
  const vp = Math.sqrt((G * star.mass * (1 + e)) / rp);

  const cosA = Math.cos(startAngle);
  const sinA = Math.sin(startAngle);

  // Position: periapsis in the startAngle direction
  const position = new Vec2D(rp * cosA, rp * sinA);

  // Velocity: perpendicular CCW in screen coords → (sinθ, -cosθ)
  const velocity = new Vec2D(sinA * vp, -cosA * vp);

  const mass = size * size * 5;
  const visualRadius = 2 + size * 1.5;

  const acceleration = gravAccel(position, star.position, star.mass);

  return {
    id,
    name,
    mass,
    visualRadius,
    color,
    position,
    velocity,
    acceleration,
    hasRing: config.hasRing,
  };
}

// ── Orbital mechanics helpers ─────────────────────────────────────────────────

// ── Orbit prediction ──────────────────────────────────────────────────────────

export interface PredictedOrbit {
  /** Semi-major axis (pixels). */
  a: number;
  /** Semi-minor axis (pixels). */
  b: number;
  /** Eccentricity [0, 1). */
  e: number;
  /** Ellipse centre x relative to the star (pixels). */
  centerX: number;
  /** Ellipse centre y relative to the star (pixels). */
  centerY: number;
  /** Angle of periapsis (radians). */
  periAngle: number;
}

/**
 * Predict the Keplerian orbit for a body at position (px, py) with velocity
 * (vx, vy) around a central mass.  Returns `null` for escape trajectories
 * (positive specific orbital energy) or degenerate cases.
 *
 * Uses the vis-viva equation for semi-major axis and the eccentricity vector
 * to derive the ellipse orientation.
 */
export function predictOrbit(
  px: number,
  py: number,
  vx: number,
  vy: number,
  starMass: number,
): PredictedOrbit | null {
  const r = Math.sqrt(px * px + py * py);
  if (r < 1) return null;
  const v2 = vx * vx + vy * vy;
  const energy = v2 / 2 - (G * starMass) / r;
  if (energy >= 0) return null; // escape trajectory
  const a = (-G * starMass) / (2 * energy);
  const rdotv = px * vx + py * vy;
  const invGM = 1 / (G * starMass);
  const ex = invGM * ((v2 - (G * starMass) / r) * px - rdotv * vx);
  const ey = invGM * ((v2 - (G * starMass) / r) * py - rdotv * vy);
  const e = Math.sqrt(ex * ex + ey * ey);
  if (e >= 1) return null;
  const b = a * Math.sqrt(1 - e * e);
  return {
    a,
    b,
    e,
    centerX: -a * ex,
    centerY: -a * ey,
    periAngle: Math.atan2(ey, ex),
  };
}

/** Estimated orbital period in simulation-seconds (Kepler's third law). */
export function orbitalPeriod(
  orbitalRadius: number,
  eccentricity: number,
  starMass: number,
): number {
  const a = orbitalRadius / (1 - eccentricity); // semi-major axis
  return 2 * Math.PI * Math.sqrt((a * a * a) / (G * starMass));
}

/** Default star. */
export const DEFAULT_STAR: Star = {
  mass: STAR_MASS,
  visualRadius: 22,
  position: new Vec2D(0, 0),
  name: "Sun",
  color: "#FFD54F",
};

/** A small pre-baked solar system used to populate the simulator on load. */
export const DEFAULT_PLANET_CONFIGS: PlanetConfig[] = [
  {
    name: "Mercury",
    color: "#B0BEC5",
    orbitalRadius: 80,
    size: 2,
    eccentricity: 0.21,
    startAngle: 0,
  },
  {
    name: "Venus",
    color: "#FFCC80",
    orbitalRadius: 130,
    size: 4,
    eccentricity: 0.007,
    startAngle: 1.2,
  },
  {
    name: "Earth",
    color: "#42A5F5",
    orbitalRadius: 180,
    size: 4.5,
    eccentricity: 0.017,
    startAngle: 2.5,
  },
  {
    name: "Mars",
    color: "#EF5350",
    orbitalRadius: 255,
    size: 3,
    eccentricity: 0.093,
    startAngle: 4.0,
  },
];
