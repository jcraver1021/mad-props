import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export interface TimerArcProps {
  /** Seconds remaining. */
  secondsLeft: number;
  /** Total duration in seconds — used to compute the arc fill percentage. */
  totalSeconds: number;
  /**
   * Diameter of the outer ring in pixels. Defaults to 120.
   * The inner circle is sized proportionally (80% of outer).
   */
  size?: number;
  /**
   * Override the automatic colour transitions.
   * By default the arc is blue above 1/3 remaining, amber above 1/6, red below.
   */
  color?: string;
  /** Additional MUI sx styles applied to the outermost Box. */
  sx?: SxProps<Theme>;
}

/**
 * Circular countdown timer rendered with a CSS conic-gradient ring.
 * Colour transitions automatically: blue → amber → red as time runs out,
 * unless `color` is provided.
 */
export default function TimerArc({
  secondsLeft,
  totalSeconds,
  size = 120,
  color,
  sx,
}: TimerArcProps) {
  const pct = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;
  const innerSize = Math.round(size * 0.8);

  const autoColor =
    secondsLeft > totalSeconds / 3
      ? "#3b82f6"
      : secondsLeft > totalSeconds / 6
        ? "#f59e0b"
        : "#ef4444";

  const resolvedColor = color ?? autoColor;

  return (
    <Box
      role="timer"
      aria-label={`${secondsLeft} seconds remaining`}
      sx={{ position: "relative", display: "inline-flex", ...sx }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `conic-gradient(${resolvedColor} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${Math.round(size / 6)}px ${resolvedColor}55`,
          transition: "background 0.5s ease",
        }}
      >
        <Box
          sx={{
            width: innerSize,
            height: innerSize,
            borderRadius: "50%",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant={size >= 100 ? "h4" : "h6"}
            sx={{
              fontWeight: 700,
              color: resolvedColor,
              transition: "color 0.5s ease",
              lineHeight: 1,
            }}
          >
            {secondsLeft}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
