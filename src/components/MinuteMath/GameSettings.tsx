import {
  Box,
  Chip,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import { type GameSettings, type Op } from "./types";

/**
 * Returns a rough grade-level label for the given settings.
 * When negative numbers are enabled the result is always "Grade 6+" since that
 * is when integers are formally introduced in most curricula.
 */
export function estimateGrade(
  ops: Op[],
  maxOperand: number,
  allowNegative = false,
): string {
  if (allowNegative) return "Grade 6+";

  const hasAdd = ops.includes("+");
  const hasSub = ops.includes("−");
  const hasMul = ops.includes("×");
  const hasDiv = ops.includes("÷");

  if (!hasMul && !hasDiv) {
    if (maxOperand <= 10) return "Grade 1";
    if (maxOperand <= 20) return "Grade 2";
    return "Grade 3";
  }

  if (!hasAdd && !hasSub) {
    if (hasMul && !hasDiv) {
      return maxOperand <= 10 ? "Grade 3" : "Grade 4";
    }
    return maxOperand <= 12 ? "Grade 4" : "Grade 5";
  }

  return maxOperand <= 12 ? "Grade 4–5" : "Grade 5+";
}

const ALL_OPS: Op[] = ["+", "−", "×", "÷"];

export interface GameSettingsProps {
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
}

/**
 * Settings panel: pick operations, maximum operand, and whether negative
 * answers are allowed. Includes a real-time grade-level estimator.
 */
export default function GameSettings({
  settings,
  onChange,
}: GameSettingsProps) {
  const toggleOp = (op: Op) => {
    const next = settings.ops.includes(op)
      ? settings.ops.filter((o) => o !== op)
      : [...settings.ops, op];
    if (next.length === 0) return; // always keep at least one op
    onChange({ ...settings, ops: next });
  };

  const grade = estimateGrade(
    settings.ops,
    settings.maxOperand,
    settings.allowNegative,
  );

  return (
    <Box
      aria-label="game settings"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Operations */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
          Operations
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {ALL_OPS.map((op) => {
            const selected = settings.ops.includes(op);
            return (
              <Chip
                key={op}
                label={op}
                aria-label={`toggle ${op}`}
                aria-pressed={selected}
                onClick={() => toggleOp(op)}
                color={selected ? "primary" : "default"}
                variant={selected ? "filled" : "outlined"}
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  height: 48,
                  width: 48,
                  "& .MuiChip-label": { px: 0 },
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Max operand slider */}
      <Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Max number:{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 700 }}>
            {settings.maxOperand}
          </Box>
        </Typography>
        <Slider
          value={settings.maxOperand}
          min={5}
          max={100}
          step={5}
          aria-label="maximum operand"
          marks={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
          onChange={(_, v) =>
            onChange({ ...settings, maxOperand: v as number })
          }
          sx={{
            color: "primary.main",
            "& .MuiSlider-markLabel": {
              color: "text.secondary",
              fontSize: "0.75rem",
            },
          }}
        />
      </Box>

      {/* Negative numbers toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: settings.allowNegative
            ? "primary.main"
            : "rgba(59, 130, 246, 0.2)",
          background: settings.allowNegative
            ? "rgba(59, 130, 246, 0.08)"
            : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Allow negative answers
          </Typography>
          <Typography variant="caption" color="text.secondary">
            e.g. 3 − 7 = −4
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={settings.allowNegative}
              onChange={(e) =>
                onChange({ ...settings, allowNegative: e.target.checked })
              }
              inputProps={{ "aria-label": "allow negative answers" }}
              color="primary"
            />
          }
          label=""
          sx={{ m: 0 }}
        />
      </Box>

      {/* Grade estimator badge */}
      <Box
        aria-label="grade estimate"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderRadius: 2,
          background: "rgba(59, 130, 246, 0.08)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Estimated level:
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, color: "primary.light" }}
        >
          {grade}
        </Typography>
      </Box>
    </Box>
  );
}
