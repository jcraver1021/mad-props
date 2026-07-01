import { describe, it, expect } from "vitest";
import { Vec2D } from "../math/vec2d";
import {
  G,
  STAR_MASS,
  DEFAULT_STAR,
  gravAccel,
  computeAcceleration,
  createPlanet,
  orbitalPeriod,
  predictOrbit,
  stepSimulation,
  PlanetConfig,
  SimPlanet,
} from "./orbital";

// ── gravAccel ─────────────────────────────────────────────────────────────────

describe("gravAccel", () => {
  it("points from body toward attractor", () => {
    // Body at (100, 0), star at origin — force should be in -x direction
    const a = gravAccel(new Vec2D(100, 0), new Vec2D(0, 0), STAR_MASS);
    expect(a.x).toBeLessThan(0);
    expect(a.y).toBeCloseTo(0);
  });

  it("magnitude equals G·M / r²", () => {
    const r = 150;
    const a = gravAccel(new Vec2D(r, 0), new Vec2D(0, 0), STAR_MASS);
    expect(Math.abs(a.x)).toBeCloseTo((G * STAR_MASS) / (r * r));
  });

  it("scales inversely with distance squared", () => {
    const a1 = gravAccel(new Vec2D(100, 0), new Vec2D(0, 0), STAR_MASS);
    const a2 = gravAccel(new Vec2D(200, 0), new Vec2D(0, 0), STAR_MASS);
    // Doubling r → force is ¼ as strong
    expect(Math.abs(a1.x) / Math.abs(a2.x)).toBeCloseTo(4);
  });

  it("returns zero for near-zero distance (softening)", () => {
    const a = gravAccel(new Vec2D(0, 0), new Vec2D(0, 0), STAR_MASS);
    expect(a.x).toBe(0);
    expect(a.y).toBe(0);
  });

  it("is symmetric in direction: bodies attract each other equally", () => {
    const posA = new Vec2D(100, 50);
    const posB = new Vec2D(200, 150);
    const mass = 1000;
    const aOnA = gravAccel(posA, posB, mass);
    const aOnB = gravAccel(posB, posA, mass);
    // Forces are equal-magnitude, opposite direction
    expect(aOnA.x).toBeCloseTo(-aOnB.x);
    expect(aOnA.y).toBeCloseTo(-aOnB.y);
  });
});

// ── orbitalPeriod ─────────────────────────────────────────────────────────────

describe("orbitalPeriod", () => {
  it("circular orbit at r=180: T = 2π√(a³/GM)", () => {
    const r = 180;
    const a = r; // circular → semi-major axis = radius
    const expected = 2 * Math.PI * Math.sqrt(a ** 3 / (G * STAR_MASS));
    expect(orbitalPeriod(r, 0, STAR_MASS)).toBeCloseTo(expected);
  });

  it("larger orbit has longer period (Kepler's third law)", () => {
    const T_inner = orbitalPeriod(100, 0, STAR_MASS);
    const T_outer = orbitalPeriod(200, 0, STAR_MASS);
    expect(T_outer).toBeGreaterThan(T_inner);
  });

  it("period scales as a^(3/2)", () => {
    const T1 = orbitalPeriod(100, 0, STAR_MASS);
    const T2 = orbitalPeriod(400, 0, STAR_MASS); // 4× larger → 8× longer
    expect(T2 / T1).toBeCloseTo(8, 3);
  });

  it("higher eccentricity with same periapsis → longer period (larger semi-major axis)", () => {
    const T_circular = orbitalPeriod(180, 0, STAR_MASS);
    const T_elliptical = orbitalPeriod(180, 0.5, STAR_MASS);
    expect(T_elliptical).toBeGreaterThan(T_circular);
  });
});

// ── createPlanet ──────────────────────────────────────────────────────────────

describe("createPlanet", () => {
  const config: PlanetConfig = {
    name: "Test",
    color: "#42A5F5",
    orbitalRadius: 180,
    size: 4,
    eccentricity: 0,
    startAngle: 0,
  };

  it("places planet at periapsis in the startAngle direction", () => {
    const p = createPlanet(config, DEFAULT_STAR, "1");
    expect(p.position.x).toBeCloseTo(180);
    expect(p.position.y).toBeCloseTo(0);
  });

  it("periapsis velocity matches vis-viva: v = √(G·M·(1+e)/r)", () => {
    const { orbitalRadius: rp, eccentricity: e } = config;
    const expected = Math.sqrt((G * STAR_MASS * (1 + e)) / rp);
    const p = createPlanet(config, DEFAULT_STAR, "1");
    expect(p.velocity.magnitude()).toBeCloseTo(expected);
  });

  it("velocity is perpendicular to position for circular orbit (startAngle=0)", () => {
    const p = createPlanet(config, DEFAULT_STAR, "1");
    // dot(position, velocity) ≈ 0
    expect(p.position.dot(p.velocity)).toBeCloseTo(0, 5);
  });

  it("respects startAngle: position rotates by startAngle", () => {
    const angle = Math.PI / 3;
    const p = createPlanet({ ...config, startAngle: angle }, DEFAULT_STAR, "1");
    expect(p.position.x).toBeCloseTo(180 * Math.cos(angle));
    expect(p.position.y).toBeCloseTo(180 * Math.sin(angle));
  });

  it("eccentricity shifts periapsis speed up", () => {
    const p_circ = createPlanet(config, DEFAULT_STAR, "1");
    const p_ecc = createPlanet(
      { ...config, eccentricity: 0.5 },
      DEFAULT_STAR,
      "2",
    );
    expect(p_ecc.velocity.magnitude()).toBeGreaterThan(
      p_circ.velocity.magnitude(),
    );
  });

  it("visual radius and mass scale with size", () => {
    const small = createPlanet({ ...config, size: 1 }, DEFAULT_STAR, "1");
    const large = createPlanet({ ...config, size: 10 }, DEFAULT_STAR, "2");
    expect(large.visualRadius).toBeGreaterThan(small.visualRadius);
    expect(large.mass).toBeGreaterThan(small.mass);
  });

  it("passes hasRing through to the SimPlanet", () => {
    const p = createPlanet({ ...config, hasRing: true }, DEFAULT_STAR, "1");
    expect(p.hasRing).toBe(true);
  });
});

// ── predictOrbit ──────────────────────────────────────────────────────────────

describe("predictOrbit", () => {
  const M = STAR_MASS;

  it("circular orbit: e ≈ 0, a = r", () => {
    const r = 200;
    // Circular velocity in screen coords (y-down): at (r,0) → (0, -v_c)
    const vc = Math.sqrt((G * M) / r);
    const orbit = predictOrbit(r, 0, 0, -vc, M);
    expect(orbit).not.toBeNull();
    expect(orbit!.e).toBeCloseTo(0, 4);
    expect(orbit!.a).toBeCloseTo(r, 2);
  });

  it("returns null at exactly escape velocity", () => {
    const r = 200;
    const v_esc = Math.sqrt((2 * G * M) / r);
    expect(predictOrbit(r, 0, v_esc, 0, M)).toBeNull();
  });

  it("returns null above escape velocity", () => {
    const r = 200;
    const v_hyp = Math.sqrt((2 * G * M) / r) * 1.1;
    expect(predictOrbit(r, 0, v_hyp, 0, M)).toBeNull();
  });

  it("elliptical orbit: e matches vis-viva prediction", () => {
    // Place at periapsis rp = 180; give periapsis velocity for e=0.4
    const rp = 180;
    const e_expected = 0.4;
    const vp = Math.sqrt((G * M * (1 + e_expected)) / rp);
    // Periapsis at (rp, 0); CCW velocity → (0, -vp)
    const orbit = predictOrbit(rp, 0, 0, -vp, M);
    expect(orbit).not.toBeNull();
    expect(orbit!.e).toBeCloseTo(e_expected, 3);
  });

  it("semi-major axis from energy: a = -GM/(2·energy)", () => {
    const r = 150;
    const vp = Math.sqrt((G * M * 1.2) / r); // slightly faster than circular
    const orbit = predictOrbit(r, 0, 0, -vp, M);
    expect(orbit).not.toBeNull();
    const energy = (vp * vp) / 2 - (G * M) / r;
    const a_expected = (-G * M) / (2 * energy);
    expect(orbit!.a).toBeCloseTo(a_expected, 2);
  });

  it("b = a·√(1-e²)", () => {
    const r = 200;
    const vc = Math.sqrt((G * M) / r);
    // Give slightly elliptical velocity
    const orbit = predictOrbit(r, 0, 0, -vc * 0.9, M);
    expect(orbit).not.toBeNull();
    const b_expected = orbit!.a * Math.sqrt(1 - orbit!.e ** 2);
    expect(orbit!.b).toBeCloseTo(b_expected, 3);
  });
});

// ── stepSimulation ────────────────────────────────────────────────────────────

describe("stepSimulation", () => {
  /** Build a planet on a circular orbit. */
  function circularPlanet(): SimPlanet {
    return createPlanet(
      {
        name: "p",
        color: "#fff",
        orbitalRadius: 180,
        size: 4,
        eccentricity: 0,
        startAngle: 0,
      },
      DEFAULT_STAR,
      "1",
    );
  }

  it("returns empty array when given empty array", () => {
    expect(stepSimulation([], DEFAULT_STAR, false, 0.016)).toHaveLength(0);
  });

  it("preserves planet count", () => {
    const planets = [circularPlanet()];
    const next = stepSimulation(planets, DEFAULT_STAR, false, 0.016);
    expect(next).toHaveLength(1);
  });

  it("planet moves after a step", () => {
    const p = circularPlanet();
    const [next] = stepSimulation([p], DEFAULT_STAR, false, 0.016);
    expect(next.position.x).not.toBeCloseTo(p.position.x, 5);
  });

  it("circular orbit stays near original radius (energy conservation)", () => {
    let planets = [circularPlanet()];
    const initialR = planets[0].position.magnitude();
    // Simulate one full period's worth of steps
    const T = orbitalPeriod(180, 0, STAR_MASS);
    const dt = 0.016;
    const steps = Math.round(T / dt);
    for (let i = 0; i < steps; i++) {
      planets = stepSimulation(planets, DEFAULT_STAR, false, dt);
    }
    const finalR = planets[0].position.magnitude();
    // Radius should stay within 0.5% of initial
    expect(Math.abs(finalR - initialR) / initialR).toBeLessThan(0.005);
  });

  it("returns new planet objects (immutable)", () => {
    const planets = [circularPlanet()];
    const next = stepSimulation(planets, DEFAULT_STAR, false, 0.016);
    expect(next[0]).not.toBe(planets[0]);
  });
});

// ── computeAcceleration ───────────────────────────────────────────────────────

describe("computeAcceleration", () => {
  it("without n-body, only star contributes", () => {
    const p1 = createPlanet(
      {
        name: "p1",
        color: "#fff",
        orbitalRadius: 180,
        size: 4,
        eccentricity: 0,
        startAngle: 0,
      },
      DEFAULT_STAR,
      "1",
    );
    const p2 = createPlanet(
      {
        name: "p2",
        color: "#f00",
        orbitalRadius: 180,
        size: 4,
        eccentricity: 0,
        startAngle: Math.PI,
      },
      DEFAULT_STAR,
      "2",
    );
    const aNoNBody = computeAcceleration(p1, DEFAULT_STAR, [p1, p2], false);
    const aStarOnly = gravAccel(
      p1.position,
      DEFAULT_STAR.position,
      DEFAULT_STAR.mass,
    );
    expect(aNoNBody.x).toBeCloseTo(aStarOnly.x);
    expect(aNoNBody.y).toBeCloseTo(aStarOnly.y);
  });

  it("with n-body, adjacent planet adds to acceleration", () => {
    const p1 = createPlanet(
      {
        name: "p1",
        color: "#fff",
        orbitalRadius: 180,
        size: 4,
        eccentricity: 0,
        startAngle: 0,
      },
      DEFAULT_STAR,
      "1",
    );
    // Large nearby planet directly above p1
    const p2: SimPlanet = {
      id: "2",
      name: "p2",
      color: "#f00",
      mass: 100_000,
      visualRadius: 10,
      hasRing: false,
      position: new Vec2D(180, 50),
      velocity: new Vec2D(0, 0),
      acceleration: new Vec2D(0, 0),
    };
    const aNBody = computeAcceleration(p1, DEFAULT_STAR, [p1, p2], true);
    const aNoNBody = computeAcceleration(p1, DEFAULT_STAR, [p1, p2], false);
    // n-body should differ — the extra planet pulls p1 in the +y direction
    expect(aNBody.y).toBeGreaterThan(aNoNBody.y);
  });
});
