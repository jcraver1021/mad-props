import { useEffect, useRef } from "react";

export type PropellerDirection = "cw" | "ccw";

export interface PropellerProps {
  /** Rotational speed in revolutions per minute. */
  rpm: number;
  /** Number of blades, 1-12. Defaults to 3. */
  bladeCount?: number;
  /** Spin direction. Defaults to clockwise. */
  direction?: PropellerDirection;
  /** Diameter of the propeller in pixels. Defaults to 240. */
  size?: number;
}

export default function Propeller({
  rpm,
  bladeCount = 3,
  direction = "cw",
  size = 240,
}: PropellerProps) {
  const groupRef = useRef<SVGGElement>(null);
  const rpmRef = useRef(rpm);
  const directionRef = useRef(direction);
  const angleRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    rpmRef.current = rpm;
  }, [rpm]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Driven by rAF rather than a CSS animation with rpm-derived
  // animation-duration: changing that duration mid-animation restarts it
  // from the keyframe origin, snapping the blades back on every speed change.
  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTRef.current > 0) {
        const dtSeconds = (ts - lastTRef.current) / 1000;
        const sign = directionRef.current === "cw" ? 1 : -1;
        // 360deg per revolution, rpm/60 revolutions per second
        angleRef.current =
          (angleRef.current + sign * rpmRef.current * 6 * dtSeconds) % 360;
        groupRef.current?.setAttribute(
          "transform",
          `rotate(${angleRef.current} 100 100)`,
        );
      }
      lastTRef.current = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const bladeAngles = Array.from(
    { length: bladeCount },
    (_, i) => (360 / bladeCount) * i,
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Propeller spinning at ${rpm} RPM`}
    >
      <defs>
        <linearGradient id="propellerBlade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/*
        Known issue: at high blade counts, overlapping ellipse strokes leave a
        visible seam at the first/last blade boundary. Fix would be rendering
        the propeller as one unified shape instead of N overlapping ellipses.
      */}
      <g ref={groupRef}>
        {bladeAngles.map((rot) => (
          <ellipse
            key={rot}
            cx="100"
            cy="55"
            rx="14"
            ry="42"
            fill="url(#propellerBlade)"
            stroke="#1e293b"
            strokeWidth="2"
            transform={`rotate(${rot} 100 100)`}
          />
        ))}
      </g>
      <circle
        cx="100"
        cy="100"
        r="16"
        fill="#8b5cf6"
        stroke="#1e293b"
        strokeWidth="3"
      />
    </svg>
  );
}
