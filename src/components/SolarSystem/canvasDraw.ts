/**
 * Pure canvas-drawing functions for the Solar System simulator.
 * All functions are side-effect-free with respect to React state — they only
 * mutate the provided CanvasRenderingContext2D.
 */
import { Vec2D } from "../../common/math/vec2d";
import { G, predictOrbit, SimPlanet, Star } from "../../common/physics/orbital";
import { hexToRgb, darkenHex } from "../../utils/color";
import { VSCALE } from "./constants";
import { BgStar, FreeformDrag } from "./types";

// ── Background ────────────────────────────────────────────────────────────────

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bgStars: BgStar[],
): void {
  ctx.fillStyle = "#050d1a";
  ctx.fillRect(0, 0, w, h);
  for (const s of bgStars) {
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
}

// ── Star ──────────────────────────────────────────────────────────────────────

export function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  star: Star,
  t: number,
): void {
  const baseColor = star.color ?? "#FFD54F";
  const rgb = hexToRgb(baseColor);
  const pulse = Math.sin(t * 0.0015) * 4;
  const glowR = star.visualRadius * 4.5 + pulse;

  // Outer glow
  const outer = ctx.createRadialGradient(
    cx,
    cy,
    star.visualRadius * 0.6,
    cx,
    cy,
    glowR,
  );
  outer.addColorStop(0, `rgba(${rgb},0.55)`);
  outer.addColorStop(0.5, `rgba(${rgb},0.18)`);
  outer.addColorStop(1, `rgba(${rgb},0)`);
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fillStyle = outer;
  ctx.fill();

  // Body (sphere shading)
  const body = ctx.createRadialGradient(
    cx - star.visualRadius * 0.3,
    cy - star.visualRadius * 0.3,
    1,
    cx,
    cy,
    star.visualRadius,
  );
  body.addColorStop(0, "#FFFDE7");
  body.addColorStop(0.4, baseColor);
  body.addColorStop(1, darkenHex(baseColor, -50));
  ctx.beginPath();
  ctx.arc(cx, cy, star.visualRadius, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();
}

// ── Orbit guides ──────────────────────────────────────────────────────────────

export function drawOrbitGuides(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planets: SimPlanet[],
): void {
  ctx.setLineDash([3, 6]);
  ctx.lineWidth = 0.8;
  for (const p of planets) {
    const r = p.position.magnitude();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${hexToRgb(p.color)},0.18)`;
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

// ── Trails ────────────────────────────────────────────────────────────────────

export function drawTrails(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planets: SimPlanet[],
  trails: Map<string, Vec2D[]>,
): void {
  for (const p of planets) {
    const trail = trails.get(p.id);
    if (!trail || trail.length < 2) continue;
    const segments = 4;
    const segLen = Math.ceil(trail.length / segments);
    for (let s = 0; s < segments; s++) {
      const start = s * segLen;
      const end = Math.min(start + segLen + 1, trail.length);
      if (end <= start + 1) continue;
      const alpha = ((s + 1) / segments) * 0.55;
      ctx.beginPath();
      ctx.moveTo(cx + trail[start].x, cy + trail[start].y);
      for (let i = start + 1; i < end; i++) {
        ctx.lineTo(cx + trail[i].x, cy + trail[i].y);
      }
      ctx.strokeStyle = `rgba(${hexToRgb(p.color)},${alpha.toFixed(2)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

// ── Planets ───────────────────────────────────────────────────────────────────

export function drawPlanets(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  planets: SimPlanet[],
  showLabels: boolean,
): void {
  for (const p of planets) {
    const px = cx + p.position.x;
    const py = cy + p.position.y;
    const r = p.visualRadius;
    const rgb = hexToRgb(p.color);

    // Soft glow
    const glow = ctx.createRadialGradient(px, py, r * 0.2, px, py, r * 4);
    glow.addColorStop(0, `rgba(${rgb},0.4)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    ctx.beginPath();
    ctx.arc(px, py, r * 4, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Ring — back half (behind planet body)
    if (p.hasRing) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.6, r * 0.5, 0.3, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "rgba(196,163,90,0.45)";
      ctx.lineWidth = r * 0.7;
      ctx.stroke();
      ctx.restore();
    }

    // Planet body
    const body = ctx.createRadialGradient(
      px - r * 0.35,
      py - r * 0.35,
      r * 0.05,
      px,
      py,
      r,
    );
    body.addColorStop(0, "#fff");
    body.addColorStop(0.25, p.color);
    body.addColorStop(1, darkenHex(p.color, -50));
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();

    // Ring — front half (in front of planet body)
    if (p.hasRing) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 2.6, r * 0.5, 0.3, 0, Math.PI);
      ctx.strokeStyle = "rgba(196,163,90,0.65)";
      ctx.lineWidth = r * 0.7;
      ctx.stroke();
      ctx.restore();
    }

    if (showLabels) {
      ctx.font = `${Math.max(10, Math.min(r + 6, 14))}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText(p.name, px, py - r - (p.hasRing ? r * 0.5 + 3 : 3));
    }
  }
}

// ── Freeform drag preview ─────────────────────────────────────────────────────

export function drawFreeformPreview(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  drag: FreeformDrag,
  starMass: number,
): void {
  const { startX: sx, startY: sy, currentX: mx, currentY: my } = drag;
  const vx = (mx - sx) * VSCALE;
  const vy = (my - sy) * VSCALE;
  const dragLen = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);

  // Ghost planet
  ctx.beginPath();
  ctx.arc(cx + sx, cy + sy, 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(100,210,255,0.4)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + sx, cy + sy, 6, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(100,210,255,0.9)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Velocity arrow
  if (dragLen > 4) {
    const ang = Math.atan2(my - sy, mx - sx);
    const aLen = 9;
    ctx.beginPath();
    ctx.moveTo(cx + sx, cy + sy);
    ctx.lineTo(cx + mx, cy + my);
    ctx.strokeStyle = "rgba(100,210,255,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + mx, cy + my);
    ctx.lineTo(
      cx + mx - aLen * Math.cos(ang - 0.4),
      cy + my - aLen * Math.sin(ang - 0.4),
    );
    ctx.lineTo(
      cx + mx - aLen * Math.cos(ang + 0.4),
      cy + my - aLen * Math.sin(ang + 0.4),
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(100,210,255,0.8)";
    ctx.fill();
  }

  // Predicted orbit ellipse — or escape line
  const orbit = predictOrbit(sx, sy, vx, vy, starMass);
  if (orbit) {
    ctx.save();
    ctx.translate(cx + orbit.centerX, cy + orbit.centerY);
    ctx.rotate(orbit.periAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, orbit.a, orbit.b, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100,210,255,0.45)";
    ctx.setLineDash([4, 6]);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  } else if (dragLen > 4) {
    const escAng = Math.atan2(vy, vx);
    ctx.beginPath();
    ctx.moveTo(cx + sx, cy + sy);
    ctx.lineTo(
      cx + sx + Math.cos(escAng) * 250,
      cy + sy + Math.sin(escAng) * 250,
    );
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgba(255,100,100,0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Circular-orbit speed hint ring (green dashed)
  const rPlanet = Math.sqrt(sx * sx + sy * sy);
  if (rPlanet > 1) {
    const vc = Math.sqrt((G * starMass) / rPlanet);
    const hintR = Math.min(vc / VSCALE, 90);
    ctx.beginPath();
    ctx.arc(cx + sx, cy + sy, hintR, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100,255,100,0.18)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
