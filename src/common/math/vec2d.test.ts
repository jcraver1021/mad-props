import { Vec2D } from "./vec2d";
import { describe, expect, test } from "vitest";

describe("Vector Addition", () => {
  test("adds vectors correctly", () => {
    const given1 = new Vec2D(2, 3);
    const given2 = new Vec2D(4, 5);
    const want = new Vec2D(6, 8);
    expect(given1.add(given2)).toStrictEqual(want);
  });
  test("adds vectors commutatively", () => {
    const given1 = new Vec2D(2, 3);
    const given2 = new Vec2D(4, 5);
    const want = new Vec2D(6, 8);
    expect(given2.add(given1)).toStrictEqual(want);
  });
  test("adds path to origin", () => {
    const given1 = new Vec2D(5, 5);
    const given2 = new Vec2D(-8, 12);
    const given3 = new Vec2D(10, -20);
    const given4 = new Vec2D(-5, 3);
    const given5 = new Vec2D(-2, 144);
    const given6 = new Vec2D(72, -72);
    const given7 = new Vec2D(72, -36);
    const given8 = new Vec2D(-80, -18);
    const given9 = new Vec2D(-64, -18);
    const want = new Vec2D();
    expect(
      given1
        .add(given2)
        .add(given3)
        .add(given4)
        .add(given5)
        .add(given6)
        .add(given7)
        .add(given8)
        .add(given9),
    ).toStrictEqual(want);
  });
});

describe("Vector Scaling", () => {
  test("scales positively", () => {
    const given = new Vec2D(2, 3);
    const scale = 5;
    const want = new Vec2D(10, 15);
    expect(given.scale(scale)).toStrictEqual(want);
  });
  test("scales negatively", () => {
    const given = new Vec2D(4, 5);
    const scale = -6;
    const want = new Vec2D(-24, -30);
    expect(given.scale(scale)).toStrictEqual(want);
  });
  test("scales to zero", () => {
    const given = new Vec2D(6, 7);
    const scale = 0;
    const want = new Vec2D();
    expect(given.scale(scale)).toStrictEqual(want);
  });
});

describe("Vector Left Rotation", () => {
  test("test one rotation", () => {
    const given = new Vec2D(2, 3);
    const want = new Vec2D(-3, 2);
    expect(given.rotateLeft()).toStrictEqual(want);
  });
  test("test cycle", () => {
    const given = new Vec2D(5, 8);
    expect(
      given.rotateLeft().rotateLeft().rotateLeft().rotateLeft(),
    ).toStrictEqual(given);
  });
  test("test undo", () => {
    const given = new Vec2D(13, 21);
    expect(given.rotateLeft().rotateRight()).toStrictEqual(given);
  });
});

describe("Vector Right Rotation", () => {
  test("test one rotation", () => {
    const given = new Vec2D(2, 4);
    const want = new Vec2D(4, -2);
    expect(given.rotateRight()).toStrictEqual(want);
  });
  test("test cycle", () => {
    const given = new Vec2D(8, 16);
    expect(
      given.rotateRight().rotateRight().rotateRight().rotateRight(),
    ).toStrictEqual(given);
  });
  test("test undo", () => {
    const given = new Vec2D(32, 64);
    expect(given.rotateRight().rotateLeft()).toStrictEqual(given);
  });
});

describe("Vector Inversion", () => {
  test("test invert", () => {
    const given = new Vec2D(10, 15);
    const want = new Vec2D(-10, -15);
    expect(given.invert()).toStrictEqual(want);
  });
  test("test invert sum", () => {
    const given = new Vec2D(21, 28);
    const want = new Vec2D();
    expect(given.add(given.invert())).toStrictEqual(want);
  });
});

describe("Vector Subtraction", () => {
  test("sub gives difference", () => {
    expect(new Vec2D(5, 3).sub(new Vec2D(2, 1))).toStrictEqual(new Vec2D(3, 2));
  });
  test("v - v = zero", () => {
    const v = new Vec2D(7, -4);
    expect(v.sub(v)).toStrictEqual(new Vec2D(0, 0));
  });
});

describe("Vector Magnitude", () => {
  test("3-4-5 triangle", () => {
    expect(new Vec2D(3, 4).magnitude()).toBeCloseTo(5);
  });
  test("zero vector", () => {
    expect(new Vec2D(0, 0).magnitude()).toBe(0);
  });
  test("magnitudeSq of (3,4) is 25", () => {
    expect(new Vec2D(3, 4).magnitudeSq()).toBe(25);
  });
  test("magnitudeSq equals magnitude squared", () => {
    const v = new Vec2D(7, -11);
    expect(v.magnitudeSq()).toBeCloseTo(v.magnitude() ** 2);
  });
});

describe("Vector Normalize", () => {
  test("unit length after normalize", () => {
    expect(new Vec2D(3, 4).normalize().magnitude()).toBeCloseTo(1);
  });
  test("direction preserved", () => {
    const v = new Vec2D(6, 0).normalize();
    expect(v.x).toBeCloseTo(1);
    expect(v.y).toBeCloseTo(0);
  });
  test("zero vector normalizes to zero", () => {
    expect(new Vec2D(0, 0).normalize()).toStrictEqual(new Vec2D(0, 0));
  });
});

describe("Vector Dot Product", () => {
  test("perpendicular vectors have dot = 0", () => {
    expect(new Vec2D(1, 0).dot(new Vec2D(0, 1))).toBe(0);
  });
  test("parallel vectors", () => {
    expect(new Vec2D(3, 0).dot(new Vec2D(5, 0))).toBe(15);
  });
  test("symmetric: a·b == b·a", () => {
    const a = new Vec2D(2, 3);
    const b = new Vec2D(-1, 4);
    expect(a.dot(b)).toBe(b.dot(a));
  });
});

describe("Vector distanceTo", () => {
  test("3-4-5 distance", () => {
    expect(new Vec2D(0, 0).distanceTo(new Vec2D(3, 4))).toBeCloseTo(5);
  });
  test("symmetric", () => {
    const a = new Vec2D(1, 2);
    const b = new Vec2D(4, 6);
    expect(a.distanceTo(b)).toBeCloseTo(b.distanceTo(a));
  });
  test("distance to self is 0", () => {
    const v = new Vec2D(7, -3);
    expect(v.distanceTo(v)).toBe(0);
  });
});

describe("Vector rotate (angle)", () => {
  test("rotate 0 is identity", () => {
    const v = new Vec2D(3, 4).rotate(0);
    expect(v.x).toBeCloseTo(3);
    expect(v.y).toBeCloseTo(4);
  });
  test("rotate π/2 maps (1,0) → (0,1)", () => {
    const v = new Vec2D(1, 0).rotate(Math.PI / 2);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(1);
  });
  test("rotate π maps (1,0) → (-1,0)", () => {
    const v = new Vec2D(1, 0).rotate(Math.PI);
    expect(v.x).toBeCloseTo(-1);
    expect(v.y).toBeCloseTo(0);
  });
  test("rotation preserves magnitude", () => {
    const v = new Vec2D(3, 4);
    expect(v.rotate(1.23).magnitude()).toBeCloseTo(v.magnitude());
  });
});

describe("Vector clone", () => {
  test("equal value but distinct object", () => {
    const v = new Vec2D(2, 7);
    const c = v.clone();
    expect(c).toStrictEqual(v);
    expect(c).not.toBe(v);
  });
});
