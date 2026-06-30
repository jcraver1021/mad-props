import { describe, it, expect } from "vitest";
import { rand } from "./math";

describe("rand", () => {
  it("returns a value within [1, max] by default", () => {
    for (let i = 0; i < 200; i++) {
      const v = rand(10);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it("respects a custom min", () => {
    for (let i = 0; i < 200; i++) {
      const v = rand(20, 5);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(20);
    }
  });

  it("always returns an integer", () => {
    for (let i = 0; i < 100; i++) {
      expect(Number.isInteger(rand(100))).toBe(true);
    }
  });

  it("returns the only possible value when min === max", () => {
    for (let i = 0; i < 20; i++) {
      expect(rand(7, 7)).toBe(7);
    }
  });

  it("can return the min value", () => {
    const results = Array.from({ length: 500 }, () => rand(10, 1));
    expect(results).toContain(1);
  });

  it("can return the max value", () => {
    const results = Array.from({ length: 500 }, () => rand(10, 1));
    expect(results).toContain(10);
  });
});
