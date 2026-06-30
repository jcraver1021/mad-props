import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

export interface ScoreItem {
  /** Short label shown beneath the value. */
  label: string;
  /** The value to display. */
  value: number | string;
  /** Optional colour for the value text. Defaults to the theme's primary text colour. */
  color?: string;
}

export type ScoreboardSize = "small" | "medium" | "large";

export interface ScoreboardProps {
  /** The items to display, rendered side by side. */
  items: ScoreItem[];
  /**
   * Controls typography scale.
   * - small  → h5
   * - medium → h3  (default, good for in-game HUD)
   * - large  → h2  (good for end-of-game summary)
   */
  size?: ScoreboardSize;
  /** Additional MUI sx styles applied to the outermost Box. */
  sx?: SxProps<Theme>;
}

const VARIANT_MAP: Record<ScoreboardSize, "h2" | "h3" | "h5"> = {
  small: "h5",
  medium: "h3",
  large: "h2",
};

/**
 * Generic scoreboard that renders a row of labelled values.
 * Suitable for in-game HUDs, results screens, or any side-by-side stat display.
 *
 * @example
 * <Scoreboard
 *   items={[
 *     { label: "correct", value: 7, color: "#22c55e" },
 *     { label: "wrong",   value: 3, color: "#ef4444" },
 *   ]}
 * />
 */
export default function Scoreboard({
  items,
  size = "medium",
  sx,
}: ScoreboardProps) {
  const variant = VARIANT_MAP[size];

  return (
    <Box
      aria-label="scoreboard"
      sx={{ display: "flex", gap: 4, alignItems: "center", ...sx }}
    >
      {items.map((item, i) => (
        <Box key={i} sx={{ textAlign: "center" }}>
          <Typography
            aria-label={`${item.label} count`}
            variant={variant}
            sx={{
              fontWeight: 800,
              lineHeight: 1,
              ...(item.color ? { color: item.color } : {}),
            }}
          >
            {item.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
