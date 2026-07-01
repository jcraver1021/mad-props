import { describe, it, expect } from "vitest";
import { hexToRgb, darkenHex } from "./color";

describe("hexToRgb", () => {
  it("converts pure red", () => {
    expect(hexToRgb("#ff0000")).toBe("255,0,0");
  });

  it("converts pure green", () => {
    expect(hexToRgb("#00ff00")).toBe("0,255,0");
  });

  it("converts pure blue", () => {
    expect(hexToRgb("#0000ff")).toBe("0,0,255");
  });

  it("works without the leading #", () => {
    expect(hexToRgb("ffffff")).toBe("255,255,255");
  });

  it("converts a mid-tone colour", () => {
    expect(hexToRgb("#42A5F5")).toBe("66,165,245");
  });

  it("converts black", () => {
    expect(hexToRgb("#000000")).toBe("0,0,0");
  });

  it("converts white", () => {
    expect(hexToRgb("#ffffff")).toBe("255,255,255");
  });
});

describe("darkenHex", () => {
  it("darkens a colour by shifting channels down", () => {
    // #505050 - 16 = #404040
    expect(darkenHex("#505050", -16)).toBe("#404040");
  });

  it("lightens a colour by shifting channels up", () => {
    // #404040 + 16 = #505050
    expect(darkenHex("#404040", 16)).toBe("#505050");
  });

  it("clamps at 0 when shift goes negative", () => {
    expect(darkenHex("#0a0a0a", -20)).toBe("#000000");
  });

  it("clamps at 255 when shift goes above max", () => {
    expect(darkenHex("#f0f0f0", 32)).toBe("#ffffff");
  });

  it("returns the same colour for a zero shift", () => {
    expect(darkenHex("#42A5F5", 0)).toBe("#42a5f5");
  });
});
