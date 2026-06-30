import { Box, TextField, Typography } from "@mui/material";
import type { KeyboardEvent, RefObject } from "react";
import type { DisplayFormat, Problem } from "./types";

export interface ProblemDisplayProps {
  problem: Problem;
  input: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  format: DisplayFormat;
  flash: "correct" | "wrong" | null;
  inputRef?: RefObject<HTMLInputElement>;
}

const BORDER_COLOR: Record<"correct" | "wrong" | "none", string> = {
  correct: "#22c55e",
  wrong: "#ef4444",
  none: "rgba(59, 130, 246, 0.3)",
};

const GLOW: Record<"correct" | "wrong" | "none", string> = {
  correct: "0 0 28px #22c55e88",
  wrong: "0 0 28px #ef444488",
  none: "0 8px 32px rgba(0, 0, 0, 0.3)",
};

const NUM_STYLE = {
  fontWeight: 800,
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1.2,
} as const;

// ---------------------------------------------------------------------------
// Shared answer TextField
// ---------------------------------------------------------------------------

interface AnswerFieldProps {
  inputRef?: RefObject<HTMLInputElement>;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  width?: string | number;
  fontSize?: string;
}

function AnswerField({
  inputRef,
  value,
  onChange,
  onKeyDown,
  width = 140,
  fontSize = "2.5rem",
}: AnswerFieldProps) {
  return (
    <TextField
      inputRef={inputRef}
      value={value}
      aria-label="answer input"
      onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ""))}
      onKeyDown={onKeyDown}
      placeholder="?"
      type="tel"
      autoComplete="off"
      inputProps={{
        style: {
          textAlign: "center",
          fontSize,
          fontWeight: 700,
          padding: "8px 12px",
        },
      }}
      sx={{
        width,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "rgba(59, 130, 246, 0.3)",
            borderWidth: 2,
          },
          "&:hover fieldset": { borderColor: "primary.main" },
          "&.Mui-focused fieldset": { borderColor: "primary.main" },
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// ProblemDisplay
// ---------------------------------------------------------------------------

/**
 * Renders a math problem with an inline answer TextField in place of the "?".
 *
 * - `horizontal`: `a  op  b  =  [___]`
 * - `vertical`:   classic stacked sheet format with operator on the left of the
 *                 second operand, a ruled line, and the answer box below.
 */
export default function ProblemDisplay({
  problem,
  input,
  onChange,
  onSubmit,
  format,
  flash,
  inputRef,
}: ProblemDisplayProps) {
  const { a, b, op } = problem;
  const flashKey = flash ?? "none";
  const borderColor = BORDER_COLOR[flashKey];
  const glow = GLOW[flashKey];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  const cardSx = {
    width: "100%",
    background: "rgba(30, 41, 59, 0.6)",
    backdropFilter: "blur(10px)",
    border: `2px solid ${borderColor}`,
    borderRadius: 3,
    boxShadow: glow,
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  };

  // ---- Horizontal --------------------------------------------------------

  if (format === "horizontal") {
    return (
      <Box
        aria-label="problem display"
        data-format="horizontal"
        sx={{
          ...cardSx,
          px: 4,
          py: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h2" sx={NUM_STYLE}>
          {a}
        </Typography>
        <Typography
          variant="h2"
          sx={{ ...NUM_STYLE, minWidth: "1.5rem", textAlign: "center" }}
        >
          {op}
        </Typography>
        <Typography variant="h2" sx={NUM_STYLE}>
          {b}
        </Typography>
        <Typography variant="h2" sx={NUM_STYLE}>
          =
        </Typography>
        <AnswerField
          inputRef={inputRef}
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          width={140}
          fontSize="2.5rem"
        />
      </Box>
    );
  }

  // ---- Vertical ----------------------------------------------------------

  return (
    <Box
      aria-label="problem display"
      data-format="vertical"
      sx={{
        ...cardSx,
        px: 4,
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/*
       * Two-column grid: [operator cell] [number cell]
       * First row has an empty operator cell so `a` aligns with the numbers in
       * the rows below it.
       */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2.5rem 1fr",
          alignItems: "baseline",
          rowGap: 0.5,
          width: "100%",
          maxWidth: 260,
        }}
      >
        {/* Row 1 – top operand (no operator) */}
        <Box />
        <Typography variant="h2" sx={{ ...NUM_STYLE, textAlign: "right" }}>
          {a}
        </Typography>

        {/* Row 2 – operator + bottom operand */}
        <Typography
          variant="h2"
          sx={{ ...NUM_STYLE, textAlign: "right", pr: 1 }}
        >
          {op}
        </Typography>
        <Typography variant="h2" sx={{ ...NUM_STYLE, textAlign: "right" }}>
          {b}
        </Typography>

        {/* Horizontal rule spanning both columns */}
        <Box
          sx={{
            gridColumn: "1 / -1",
            height: 3,
            bgcolor: "rgba(241, 245, 249, 0.5)",
            my: 0.75,
            borderRadius: 1,
          }}
        />

        {/* Answer box spanning both columns */}
        <Box sx={{ gridColumn: "1 / -1" }}>
          <AnswerField
            inputRef={inputRef}
            value={input}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            width="100%"
            fontSize="2rem"
          />
        </Box>
      </Box>
    </Box>
  );
}
