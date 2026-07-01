import { Vec2D } from "../math/vec2d";
import { G, STAR_MASS, Star, SimPlanet, PlanetConfig } from "./orbital";

// ── File format ───────────────────────────────────────────────────────────────

export interface SolarSystemFilePlanet {
  name: string;
  /** Semi-major axis in AU (units='au') or pixels (units='pixels'). */
  semiMajorAxis: number;
  eccentricity: number;
  /** Planetary radius in Earth radii (au mode) or visual size 1–10 (pixels mode). */
  radius: number;
  color: string;
  startAngle?: number;
  hasRing?: boolean;
}

export interface SolarSystemFileStar {
  name: string;
  /** Star mass in solar masses (units='au') or sim units (units='pixels'). */
  mass: number;
  /** Star radius in AU (units='au') or pixels (units='pixels'). */
  radius: number;
  color: string;
}

export interface SolarSystemFile {
  version: "1.0";
  name: string;
  description?: string;
  /** 'au' uses real astronomical units; 'pixels' uses raw sim pixel values. */
  units: "au" | "pixels";
  star: SolarSystemFileStar;
  planets: SolarSystemFilePlanet[];
}

// ── Import ────────────────────────────────────────────────────────────────────

export interface ImportResult {
  star: Star;
  configs: PlanetConfig[];
  systemName: string;
}

/**
 * Convert a SolarSystemFile to a Star + PlanetConfig[] ready for the sim.
 * `canvasWidth` / `canvasHeight` are used to scale AU → pixels.
 */
export function importSolarSystem(
  file: SolarSystemFile,
  canvasWidth: number,
  canvasHeight: number,
): ImportResult {
  const canvasRadius = Math.min(canvasWidth || 800, canvasHeight || 600) / 2;

  if (file.units === "au") {
    const maxSMA = Math.max(...file.planets.map((p) => p.semiMajorAxis));
    // Largest orbit fills ~80% of the canvas radius
    const pixelsPerAU = (canvasRadius * 0.8) / maxSMA;

    // Sim star mass: scale STAR_MASS by the star's solar mass ratio
    const simMass = STAR_MASS * file.star.mass;
    // Visual radius: clamp to a reasonable range
    const visualRadius = Math.max(
      12,
      Math.min(40, file.star.radius * pixelsPerAU * 110),
    );

    const star: Star = {
      mass: simMass,
      visualRadius,
      position: new Vec2D(0, 0),
      name: file.star.name,
      color: file.star.color,
    };

    // Normalize planet sizes so the largest gets visual size ~9
    const maxRadius = Math.max(...file.planets.map((p) => p.radius));

    const configs: PlanetConfig[] = file.planets.map((p, i) => {
      const periapsisPx = p.semiMajorAxis * (1 - p.eccentricity) * pixelsPerAU;
      const size = Math.max(
        1.5,
        Math.min(10, (p.radius / maxRadius) * 8 + 1.5),
      );
      return {
        name: p.name,
        color: p.color,
        orbitalRadius: periapsisPx,
        size,
        eccentricity: p.eccentricity,
        startAngle: p.startAngle ?? i * ((Math.PI * 2) / file.planets.length),
        hasRing: p.hasRing,
      };
    });

    return { star, configs, systemName: file.name };
  } else {
    // pixels mode — values are already in sim units
    const star: Star = {
      mass: file.star.mass,
      visualRadius: file.star.radius,
      position: new Vec2D(0, 0),
      name: file.star.name,
      color: file.star.color,
    };

    const configs: PlanetConfig[] = file.planets.map((p, i) => ({
      name: p.name,
      color: p.color,
      orbitalRadius: p.semiMajorAxis * (1 - p.eccentricity),
      size: p.radius,
      eccentricity: p.eccentricity,
      startAngle: p.startAngle ?? i * ((Math.PI * 2) / file.planets.length),
      hasRing: p.hasRing,
    }));

    return { star, configs, systemName: file.name };
  }
}

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Serialize the current simulation state to a SolarSystemFile.
 * Exports in 'pixels' units so the file round-trips exactly.
 */
export function exportSolarSystem(
  systemName: string,
  star: Star,
  planets: SimPlanet[],
  metas: { orbitalRadius: number; eccentricity: number; startAngle?: number }[],
): SolarSystemFile {
  return {
    version: "1.0",
    name: systemName,
    units: "pixels",
    star: {
      name: star.name ?? "Star",
      mass: star.mass,
      radius: star.visualRadius,
      color: star.color ?? "#FFD54F",
    },
    planets: planets.map((p, i) => {
      const rp = metas[i]?.orbitalRadius ?? p.position.magnitude();
      const e = metas[i]?.eccentricity ?? 0;
      // Store true semi-major axis (a = rp / (1−e)) so that pixels-mode reimport
      // correctly recovers periapsis via orbitalRadius = a * (1−e).
      const a = e < 1 ? rp / (1 - e) : rp;
      return {
        name: p.name,
        color: p.color,
        semiMajorAxis: a,
        eccentricity: e,
        radius: Math.round(((p.visualRadius - 2) / 1.5) * 10) / 10,
        startAngle: metas[i]?.startAngle,
        hasRing: p.hasRing || undefined,
      };
    }),
  };
}

// Re-export G so consumers can compute orbital mechanics without importing orbital directly
export { G };
