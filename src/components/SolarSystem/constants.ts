/** Maximum trail length (number of recorded positions per planet). */
export const TRAIL_MAX = 150;

/** Record a trail point every N animation frames. */
export const TRAIL_SAMPLE_EVERY = 2;

/**
 * Freeform velocity scale: 1 pixel of mouse drag = VSCALE px/s of sim velocity.
 * Tuned so that ~100 px of drag gives circular-orbit speed at ~200 px from the star.
 */
export const VSCALE = 0.5;

/** Colour palette for planets and freeform bodies. */
export const PLANET_COLORS: string[] = [
  "#B0BEC5",
  "#42A5F5",
  "#EF5350",
  "#FF8A65",
  "#FFC107",
  "#66BB6A",
  "#AB47BC",
  "#26C6DA",
  "#EC407A",
  "#8D6E63",
  "#FFEE58",
  "#78909C",
];
