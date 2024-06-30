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
});

describe("Vector Scaling", () => {
  test("scales positively", () => {
    const given = new Vec2D(2, 3);
    const scale = 5;
    const want = new Vec2D(10, 15);
    expect(given.scale(scale)).toStrictEqual(want);
  });
  test("scales negatively", () => {
    const given = new Vec2D(2, 3);
    const scale = -4;
    const want = new Vec2D(-8, -12);
    expect(given.scale(scale)).toStrictEqual(want);
  });
  test("scales to zero", () => {
    const given = new Vec2D(2, 3);
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
    const given = new Vec2D(2, 3);
    expect(
      given.rotateLeft().rotateLeft().rotateLeft().rotateLeft(),
    ).toStrictEqual(given);
  });
  test("test undo", () => {
    const given = new Vec2D(2, 3);
    expect(given.rotateLeft().rotateRight()).toStrictEqual(given);
  });
});

describe("Vector Right Rotation", () => {
  test("test one rotation", () => {
    const given = new Vec2D(2, 3);
    const want = new Vec2D(3, -2);
    expect(given.rotateRight()).toStrictEqual(want);
  });
  test("test cycle", () => {
    const given = new Vec2D(2, 3);
    expect(
      given.rotateRight().rotateRight().rotateRight().rotateRight(),
    ).toStrictEqual(given);
  });
  test("test undo", () => {
    const given = new Vec2D(2, 3);
    expect(given.rotateRight().rotateLeft()).toStrictEqual(given);
  });
});

describe("Vector Inversion", () => {
  test("test invert", () => {
    const given = new Vec2D(2, 3);
    const want = new Vec2D(-2, -3);
    expect(given.invert()).toStrictEqual(want);
  });
  test("test invert sum", () => {
    const given = new Vec2D(2, 3);
    const want = new Vec2D();
    expect(given.add(given.invert())).toStrictEqual(want);
  });
});
