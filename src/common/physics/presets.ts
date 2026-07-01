import { SolarSystemFile } from "./solarSystemFormat";

// ── Our Solar System ──────────────────────────────────────────────────────────

export const SOLAR_SYSTEM: SolarSystemFile = {
  version: "1.0",
  name: "Solar System",
  description: "All 8 planets, real orbital elements",
  units: "au",
  star: {
    name: "Sun",
    mass: 1.0,
    radius: 0.00465, // solar radii in AU
    color: "#FFD54F",
  },
  planets: [
    {
      name: "Mercury",
      semiMajorAxis: 0.387,
      eccentricity: 0.206,
      radius: 0.38,
      color: "#B0BEC5",
    },
    {
      name: "Venus",
      semiMajorAxis: 0.723,
      eccentricity: 0.007,
      radius: 0.95,
      color: "#FFCC80",
    },
    {
      name: "Earth",
      semiMajorAxis: 1.0,
      eccentricity: 0.017,
      radius: 1.0,
      color: "#42A5F5",
    },
    {
      name: "Mars",
      semiMajorAxis: 1.524,
      eccentricity: 0.093,
      radius: 0.53,
      color: "#EF5350",
    },
    {
      name: "Jupiter",
      semiMajorAxis: 5.203,
      eccentricity: 0.049,
      radius: 11.2,
      color: "#FF8A65",
    },
    {
      name: "Saturn",
      semiMajorAxis: 9.537,
      eccentricity: 0.057,
      radius: 9.45,
      color: "#FFC107",
      hasRing: true,
    },
    {
      name: "Uranus",
      semiMajorAxis: 19.19,
      eccentricity: 0.046,
      radius: 4.01,
      color: "#80DEEA",
    },
    {
      name: "Neptune",
      semiMajorAxis: 30.07,
      eccentricity: 0.01,
      radius: 3.88,
      color: "#5C6BC0",
    },
  ],
};

// ── TRAPPIST-1 ────────────────────────────────────────────────────────────────
// An ultra-cool red dwarf with 7 Earth-sized planets, 3 in the habitable zone.
// Orbital elements: Agol et al. 2021.

export const TRAPPIST_1: SolarSystemFile = {
  version: "1.0",
  name: "TRAPPIST-1",
  description: "7 Earth-sized worlds, 3 potentially habitable",
  units: "au",
  star: {
    name: "TRAPPIST-1",
    mass: 0.089, // solar masses
    radius: 0.0001144, // AU (~0.121 R_sun)
    color: "#FF7043",
  },
  planets: [
    {
      name: "TRAPPIST-1b",
      semiMajorAxis: 0.01154,
      eccentricity: 0.006,
      radius: 1.116,
      color: "#FF8A65",
    },
    {
      name: "TRAPPIST-1c",
      semiMajorAxis: 0.0158,
      eccentricity: 0.002,
      radius: 1.097,
      color: "#FFCC80",
    },
    {
      name: "TRAPPIST-1d",
      semiMajorAxis: 0.02228,
      eccentricity: 0.001,
      radius: 0.788,
      color: "#A5D6A7",
    },
    {
      name: "TRAPPIST-1e",
      semiMajorAxis: 0.02817,
      eccentricity: 0.005,
      radius: 0.92,
      color: "#42A5F5",
    },
    {
      name: "TRAPPIST-1f",
      semiMajorAxis: 0.0371,
      eccentricity: 0.001,
      radius: 1.045,
      color: "#80CBC4",
    },
    {
      name: "TRAPPIST-1g",
      semiMajorAxis: 0.0451,
      eccentricity: 0.002,
      radius: 1.129,
      color: "#B39DDB",
    },
    {
      name: "TRAPPIST-1h",
      semiMajorAxis: 0.063,
      eccentricity: 0.001,
      radius: 0.755,
      color: "#90CAF9",
    },
  ],
};

// ── Kepler-90 ─────────────────────────────────────────────────────────────────
// The first 8-planet system found outside our own. Kepler-90i was discovered
// in 2017 by a Google/NASA neural network scanning Kepler photometry data.

export const KEPLER_90: SolarSystemFile = {
  version: "1.0",
  name: "Kepler-90",
  description: "8-planet system — Kepler-90i found by AI in 2017",
  units: "au",
  star: {
    name: "Kepler-90",
    mass: 1.13, // solar masses (G-type, slightly larger than Sun)
    radius: 0.00651, // AU (~1.2 R_sun)
    color: "#FFF59D",
  },
  planets: [
    {
      name: "Kepler-90b",
      semiMajorAxis: 0.074,
      eccentricity: 0.02,
      radius: 1.31,
      color: "#FF8A65",
    },
    {
      name: "Kepler-90c",
      semiMajorAxis: 0.089,
      eccentricity: 0.02,
      radius: 1.18,
      color: "#FFCC80",
    },
    {
      name: "Kepler-90i",
      semiMajorAxis: 0.108,
      eccentricity: 0.01,
      radius: 1.32,
      color: "#F48FB1", // pink — to mark the AI discovery
    },
    {
      name: "Kepler-90d",
      semiMajorAxis: 0.32,
      eccentricity: 0.02,
      radius: 2.88,
      color: "#A5D6A7",
    },
    {
      name: "Kepler-90e",
      semiMajorAxis: 0.422,
      eccentricity: 0.02,
      radius: 2.67,
      color: "#42A5F5",
    },
    {
      name: "Kepler-90f",
      semiMajorAxis: 0.48,
      eccentricity: 0.02,
      radius: 2.89,
      color: "#80CBC4",
    },
    {
      name: "Kepler-90g",
      semiMajorAxis: 0.71,
      eccentricity: 0.02,
      radius: 8.13,
      color: "#FF8A65",
    },
    {
      name: "Kepler-90h",
      semiMajorAxis: 1.01,
      eccentricity: 0.02,
      radius: 11.3,
      color: "#FFC107",
    },
  ],
};

export const PRESETS = [SOLAR_SYSTEM, TRAPPIST_1, KEPLER_90];
