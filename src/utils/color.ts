/**
 * Convert a 6-digit hex color string to an "r,g,b" triplet string.
 * Useful for constructing rgba() CSS values: `rgba(${hexToRgb(c)},0.5)`.
 */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

/**
 * Shift every channel of a hex color by `pct` (negative = darker, positive = lighter).
 * Values are clamped to [0, 255].
 */
export function darkenHex(hex: string, pct: number): string {
  const h = hex.replace("#", "");
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  const r = clamp(parseInt(h.substring(0, 2), 16) + pct);
  const g = clamp(parseInt(h.substring(2, 4), 16) + pct);
  const b = clamp(parseInt(h.substring(4, 6), 16) + pct);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
