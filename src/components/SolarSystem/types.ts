/** A decorative background star rendered on the canvas. */
export interface BgStar {
  /** Normalised x position [0, 1]. */
  x: number;
  /** Normalised y position [0, 1]. */
  y: number;
  /** Radius in pixels. */
  r: number;
  /** Opacity [0, 1]. */
  alpha: number;
}

/**
 * UI-facing metadata for a planet.  Kept in React state so the sidebar can
 * render without touching the physics refs.
 */
export interface PlanetMeta {
  id: string;
  name: string;
  color: string;
  /** Periapsis distance from star in pixels (used for period display). */
  orbitalRadius: number;
  eccentricity: number;
  startAngle?: number;
}

/** Live state of a freeform click-drag interaction on the canvas. */
export interface FreeformDrag {
  isDragging: boolean;
  /** Planet start position, relative to star centre (pixels). */
  startX: number;
  startY: number;
  /** Current mouse position, relative to star centre (pixels). */
  currentX: number;
  currentY: number;
}
