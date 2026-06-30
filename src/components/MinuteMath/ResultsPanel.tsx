import { Box, Button, Typography } from "@mui/material";
import Scoreboard from "../Scoreboard/Scoreboard";
import type { ProblemHistoryEntry } from "./types";

export interface ResultsPanelProps {
  correct: number;
  attempted: number;
  history: ProblemHistoryEntry[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
}

function getMessage(correct: number): string {
  if (correct === 0) return "Keep practicing!";
  if (correct < 10) return "Good effort — keep it up!";
  if (correct < 20) return "Nice work!";
  if (correct < 30) return "Great job!";
  return "Math wizard! 🏆";
}

/**
 * End-of-game results summary with problem history and action buttons.
 * Uses the generic Scoreboard for the correct/attempted display.
 */
export default function ResultsPanel({
  correct,
  attempted,
  history,
  onPlayAgain,
  onChangeSettings,
}: ResultsPanelProps) {
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  return (
    <Box
      aria-label="results panel"
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Summary card */}
      <Box
        sx={{
          background: "rgba(30, 41, 59, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: 3,
          px: 4,
          py: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Time's up!
        </Typography>

        <Scoreboard
          size="large"
          items={[
            { label: "correct", value: correct, color: "#22c55e" },
            { label: "attempted", value: attempted },
          ]}
          sx={{ my: 1 }}
        />

        {attempted > 0 && (
          <Typography aria-label="accuracy" variant="h6" color="text.secondary">
            {accuracy}% accuracy
          </Typography>
        )}

        <Typography
          aria-label="encouragement message"
          variant="body1"
          sx={{ mt: 1, fontWeight: 600 }}
        >
          {getMessage(correct)}
        </Typography>
      </Box>

      {/* Problem history */}
      {history.length > 0 && (
        <Box
          aria-label="problem history"
          sx={{
            background: "rgba(30, 41, 59, 0.4)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderRadius: 3,
            px: 3,
            py: 2,
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Problem History
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0.5,
            }}
          >
            {history.map((entry, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  background: entry.ok
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    color: entry.ok ? "#22c55e" : "#ef4444",
                    fontWeight: 700,
                    minWidth: 16,
                  }}
                >
                  {entry.ok ? "✓" : "✗"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {entry.problem.a} {entry.problem.op} {entry.problem.b} ={" "}
                  <strong>{entry.problem.answer}</strong>
                  {!entry.ok && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {" "}
                      (you: {entry.userAnswer})
                    </Typography>
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onPlayAgain}
          sx={{
            py: 1.5,
            fontWeight: 700,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            },
          }}
        >
          Play Again
        </Button>
        <Button
          fullWidth
          variant="outlined"
          size="large"
          onClick={onChangeSettings}
          sx={{
            py: 1.5,
            fontWeight: 700,
            borderColor: "rgba(59, 130, 246, 0.4)",
            "&:hover": {
              borderColor: "primary.main",
              background: "rgba(59, 130, 246, 0.05)",
            },
          }}
        >
          Change Settings
        </Button>
      </Box>
    </Box>
  );
}
