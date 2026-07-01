import { describe, it, expect } from "vitest";
import { Vec2D } from "../math/vec2d";
import { STAR_MASS, DEFAULT_STAR } from "./orbital";
import {
  importSolarSystem,
  exportSolarSystem,
  SolarSystemFile,
} from "./solarSystemFormat";
import { SOLAR_SYSTEM, TRAPPIST_1, KEPLER_90 } from "./presets";

// ── importSolarSystem (AU mode) ───────────────────────────────────────────────

describe("importSolarSystem — AU mode", () => {
  const singlePlanet: SolarSystemFile = {
    version: "1.0",
    name: "Test System",
    units: "au",
    star: { name: "Sol", mass: 1.0, radius: 0.005, color: "#FFD54F" },
    planets: [
      {
        name: "Planet A",
        semiMajorAxis: 1.0,
        eccentricity: 0,
        radius: 1.0,
        color: "#42A5F5",
      },
    ],
  };

  it("scales the outermost orbit to ~80% of canvas radius", () => {
    const { configs } = importSolarSystem(singlePlanet, 800, 600);
    // canvasRadius = min(800,600)/2 = 300; 80% = 240 px
    // periapsis = semiMajorAxis * (1-e) * pxPerAU = 1.0 * 1.0 * 240 = 240
    expect(configs[0].orbitalRadius).toBeCloseTo(240);
  });

  it("scales star mass from solar masses to sim units", () => {
    const { star } = importSolarSystem(singlePlanet, 800, 600);
    expect(star.mass).toBeCloseTo(STAR_MASS * 1.0);
  });

  it("applies star name and color", () => {
    const { star } = importSolarSystem(singlePlanet, 800, 600);
    expect(star.name).toBe("Sol");
    expect(star.color).toBe("#FFD54F");
  });

  it("systemName matches file name", () => {
    const { systemName } = importSolarSystem(singlePlanet, 800, 600);
    expect(systemName).toBe("Test System");
  });

  it("returns one config per planet", () => {
    const { configs } = importSolarSystem(singlePlanet, 800, 600);
    expect(configs).toHaveLength(1);
  });

  it("multi-planet: inner planet orbit < outer planet orbit", () => {
    const twoP: SolarSystemFile = {
      ...singlePlanet,
      planets: [
        {
          name: "Inner",
          semiMajorAxis: 0.5,
          eccentricity: 0,
          radius: 1,
          color: "#f00",
        },
        {
          name: "Outer",
          semiMajorAxis: 2.0,
          eccentricity: 0,
          radius: 1,
          color: "#00f",
        },
      ],
    };
    const { configs } = importSolarSystem(twoP, 800, 600);
    expect(configs[0].orbitalRadius).toBeLessThan(configs[1].orbitalRadius);
  });

  it("eccentricity is preserved in config", () => {
    const eccentric: SolarSystemFile = {
      ...singlePlanet,
      planets: [
        {
          name: "p",
          semiMajorAxis: 1.0,
          eccentricity: 0.5,
          radius: 1.0,
          color: "#fff",
        },
      ],
    };
    const { configs } = importSolarSystem(eccentric, 800, 600);
    expect(configs[0].eccentricity).toBeCloseTo(0.5);
  });

  it("hasRing passes through to config", () => {
    const ringed: SolarSystemFile = {
      ...singlePlanet,
      planets: [
        {
          name: "Ringed",
          semiMajorAxis: 1.0,
          eccentricity: 0,
          radius: 1.0,
          color: "#fff",
          hasRing: true,
        },
      ],
    };
    const { configs } = importSolarSystem(ringed, 800, 600);
    expect(configs[0].hasRing).toBe(true);
  });

  it("falls back gracefully when canvas size is zero", () => {
    // Should not throw; uses 800×600 fallback
    expect(() => importSolarSystem(singlePlanet, 0, 0)).not.toThrow();
  });
});

// ── importSolarSystem (pixels mode) ──────────────────────────────────────────

describe("importSolarSystem — pixels mode", () => {
  const pixelFile: SolarSystemFile = {
    version: "1.0",
    name: "Pixel System",
    units: "pixels",
    star: { name: "MyStar", mass: STAR_MASS, radius: 22, color: "#FF7043" },
    planets: [
      {
        name: "P1",
        semiMajorAxis: 180,
        eccentricity: 0,
        radius: 4,
        color: "#42A5F5",
      },
    ],
  };

  it("passes star mass through unchanged", () => {
    const { star } = importSolarSystem(pixelFile, 800, 600);
    expect(star.mass).toBeCloseTo(STAR_MASS);
  });

  it("periapsis = semiMajorAxis * (1 - e)", () => {
    const { configs } = importSolarSystem(pixelFile, 800, 600);
    expect(configs[0].orbitalRadius).toBeCloseTo(180);
  });
});

// ── exportSolarSystem ─────────────────────────────────────────────────────────

describe("exportSolarSystem", () => {
  it("version is 1.0", () => {
    const file = exportSolarSystem("Test", DEFAULT_STAR, [], []);
    expect(file.version).toBe("1.0");
  });

  it("name matches argument", () => {
    const file = exportSolarSystem("My System", DEFAULT_STAR, [], []);
    expect(file.name).toBe("My System");
  });

  it("uses pixels units", () => {
    const file = exportSolarSystem("Test", DEFAULT_STAR, [], []);
    expect(file.units).toBe("pixels");
  });

  it("exports star name and color", () => {
    const file = exportSolarSystem("Test", DEFAULT_STAR, [], []);
    expect(file.star.name).toBe("Sun");
    expect(file.star.color).toBe("#FFD54F");
  });

  it("round-trips: import → export → import preserves orbit radii", () => {
    const { star, configs } = importSolarSystem(SOLAR_SYSTEM, 800, 600);
    // Build fake SimPlanets from configs (position not needed for export)
    const fakeMetas = configs.map((c) => ({
      orbitalRadius: c.orbitalRadius,
      eccentricity: c.eccentricity,
      startAngle: c.startAngle,
    }));
    const fakePlanets = configs.map((c, i) => ({
      id: String(i),
      name: c.name,
      color: c.color,
      mass: 20,
      visualRadius: 5,
      position: new Vec2D(c.orbitalRadius, 0),
      velocity: new Vec2D(0, 0),
      acceleration: new Vec2D(0, 0),
    }));
    const exported = exportSolarSystem(
      "Solar System",
      star,
      fakePlanets,
      fakeMetas,
    );
    const reimported = importSolarSystem(exported, 800, 600);
    // Orbit radii should be preserved (pixels round-trip)
    reimported.configs.forEach((rc, i) => {
      expect(rc.orbitalRadius).toBeCloseTo(configs[i].orbitalRadius, 1);
    });
  });
});

// ── Presets smoke tests ───────────────────────────────────────────────────────

describe("preset: SOLAR_SYSTEM", () => {
  it("has 8 planets", () => {
    expect(SOLAR_SYSTEM.planets).toHaveLength(8);
  });

  it("imports without throwing", () => {
    expect(() => importSolarSystem(SOLAR_SYSTEM, 1200, 800)).not.toThrow();
  });

  it("Saturn has hasRing: true", () => {
    const saturn = SOLAR_SYSTEM.planets.find((p) => p.name === "Saturn");
    expect(saturn?.hasRing).toBe(true);
  });

  it("outer planets have larger semi-major axes", () => {
    const smas = SOLAR_SYSTEM.planets.map((p) => p.semiMajorAxis);
    for (let i = 1; i < smas.length; i++) {
      expect(smas[i]).toBeGreaterThan(smas[i - 1]);
    }
  });
});

describe("preset: TRAPPIST_1", () => {
  it("has 7 planets", () => {
    expect(TRAPPIST_1.planets).toHaveLength(7);
  });

  it("star mass is much less than 1 solar mass", () => {
    expect(TRAPPIST_1.star.mass).toBeLessThan(0.1);
  });

  it("imports to a star with correct scaled mass", () => {
    const { star } = importSolarSystem(TRAPPIST_1, 800, 600);
    expect(star.mass).toBeCloseTo(STAR_MASS * TRAPPIST_1.star.mass);
  });
});

describe("preset: KEPLER_90", () => {
  it("has 8 planets", () => {
    expect(KEPLER_90.planets).toHaveLength(8);
  });

  it("contains the AI-discovered Kepler-90i", () => {
    expect(
      KEPLER_90.planets.find((p) => p.name === "Kepler-90i"),
    ).toBeDefined();
  });

  it("star is slightly more massive than the Sun", () => {
    expect(KEPLER_90.star.mass).toBeGreaterThan(1.0);
  });
});
