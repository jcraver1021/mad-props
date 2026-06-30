import {
  Box,
  Button,
  Container,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import GameSettings from "../components/MinuteMath/GameSettings";
import ProblemDisplay from "../components/MinuteMath/ProblemDisplay";
import ResultsPanel from "../components/MinuteMath/ResultsPanel";
import TimerArc from "../components/TimerArc/TimerArc";
import Scoreboard from "../components/Scoreboard/Scoreboard";
import { rand } from "../utils/math";
import {
  DEFAULT_SETTINGS,
  DURATION_SECONDS,
  type DisplayFormat,
  type GameSettings as GameSettingsType,
  type Op,
  type Problem,
  type ProblemHistoryEntry,
} from "../components/MinuteMath/types";

export function generateProblem(settings: GameSettingsType): Problem {
  const { ops, maxOperand, allowNegative } = settings;
  const op = ops[Math.floor(Math.random() * ops.length)] as Op;

  if (op === "+") {
    const a = rand(maxOperand);
    const b = rand(maxOperand);
    return { a, b, op, answer: a + b };
  }

  if (op === "−") {
    const a = rand(maxOperand);
    if (allowNegative) {
      const b = rand(maxOperand);
      return { a, b, op, answer: a - b };
    }
    const b = rand(Math.min(a, maxOperand));
    return { a, b, op, answer: a - b };
  }

  if (op === "×") {
    const a = rand(maxOperand);
    const b = rand(maxOperand);
    return { a, b, op, answer: a * b };
  }

  // ÷: generate answer and divisor first so the quotient is always a whole number
  const answer = rand(maxOperand);
  const b = rand(maxOperand);
  return { a: b * answer, b, op: "÷", answer };
}

type Phase = "setup" | "playing" | "results";

const defaultFormat = "vertical" as DisplayFormat;

export default function MinuteMath() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [phase, setPhase] = useState<Phase>("setup");
  const [settings, setSettings] = useState<GameSettingsType>(DEFAULT_SETTINGS);
  const [format, setFormat] = useState<DisplayFormat>(defaultFormat);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(DURATION_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [history, setHistory] = useState<ProblemHistoryEntry[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const nextProblem = useCallback(
    (s: GameSettingsType) => {
      setProblem(generateProblem(s));
      setInput("");
      focusInput();
    },
    [focusInput],
  );

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
  }, []);

  // ---------------------------------------------------------------------------
  // Game lifecycle
  // ---------------------------------------------------------------------------

  const startGame = useCallback(() => {
    setCorrect(0);
    setAttempted(0);
    setHistory([]);
    setSecondsLeft(DURATION_SECONDS);
    setFlash(null);
    nextProblem(settings);
    setPhase("playing");
  }, [settings, nextProblem]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          endGame();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, endGame]);

  // ---------------------------------------------------------------------------
  // Answer submission
  // ---------------------------------------------------------------------------

  const submitAnswer = useCallback(() => {
    if (!problem || input.trim() === "") return;
    const userAnswer = parseInt(input, 10);
    if (isNaN(userAnswer)) return;

    const ok = userAnswer === problem.answer;
    setCorrect((c) => c + (ok ? 1 : 0));
    setAttempted((a) => a + 1);
    setHistory((h) => [...h, { problem, userAnswer, ok }]);
    setFlash(ok ? "correct" : "wrong");

    setTimeout(() => {
      setFlash(null);
      nextProblem(settings);
    }, 350);
  }, [problem, input, settings, nextProblem]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%)",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 6,
            gap: 3,
          }}
        >
          {/* ---- Header ---- */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Minute Math
            </Typography>
            {phase === "setup" && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Solve as many problems as you can in 60 seconds
              </Typography>
            )}
          </Box>

          {/* ================================================================
               SETUP PHASE
          ================================================================ */}
          {phase === "setup" && (
            <Box
              sx={{
                width: "100%",
                background: "rgba(30, 41, 59, 0.5)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: 3,
                px: 4,
                py: 4,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <GameSettings settings={settings} onChange={setSettings} />

              {/* Format preference */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  Problem layout
                </Typography>
                <ToggleButtonGroup
                  value={format}
                  exclusive
                  onChange={(_, v) => v && setFormat(v)}
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      color: "text.secondary",
                      borderColor: "rgba(59, 130, 246, 0.2)",
                      py: 1.5,
                      gap: 1,
                      "&.Mui-selected": {
                        background: "rgba(59, 130, 246, 0.15)",
                        color: "primary.light",
                        borderColor: "primary.main",
                      },
                    },
                  }}
                >
                  <ToggleButton value="vertical" aria-label="vertical format">
                    <Typography sx={{ fontSize: "1.1rem" }}>↓</Typography>
                    <Typography variant="body2">Vertical</Typography>
                  </ToggleButton>
                  <ToggleButton
                    value="horizontal"
                    aria-label="horizontal format"
                  >
                    <Typography sx={{ fontSize: "1.1rem" }}>→</Typography>
                    <Typography variant="body2">Horizontal</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={startGame}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  },
                }}
              >
                Start!
              </Button>
            </Box>
          )}

          {/* ================================================================
               PLAYING PHASE
          ================================================================ */}
          {phase === "playing" && problem && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Timer + scoreboard row */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TimerArc
                  secondsLeft={secondsLeft}
                  totalSeconds={DURATION_SECONDS}
                />
                <Scoreboard
                  items={[
                    { label: "correct", value: correct, color: "#22c55e" },
                    {
                      label: "wrong",
                      value: attempted - correct,
                      color: "#ef4444",
                    },
                  ]}
                />
              </Box>

              {/* Progress bar */}
              <LinearProgress
                variant="determinate"
                value={(secondsLeft / DURATION_SECONDS) * 100}
                sx={{
                  width: "100%",
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.08)",
                  "& .MuiLinearProgress-bar": {
                    background:
                      secondsLeft > 20
                        ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                        : secondsLeft > 10
                          ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                          : "#ef4444",
                    transition: "background 0.5s ease",
                    borderRadius: 3,
                  },
                }}
              />

              {/* Problem card with inline answer */}
              <ProblemDisplay
                problem={problem}
                input={input}
                onChange={setInput}
                onSubmit={submitAnswer}
                format={format}
                flash={flash}
                inputRef={inputRef}
              />

              {/* Submit + format toggle row */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={submitAnswer}
                  disabled={input.trim() === ""}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    },
                  }}
                >
                  Submit
                </Button>

                <ToggleButtonGroup
                  value={format}
                  exclusive
                  onChange={(_, v) => v && setFormat(v)}
                  size="small"
                  sx={{
                    "& .MuiToggleButton-root": {
                      color: "text.secondary",
                      borderColor: "rgba(59, 130, 246, 0.2)",
                      px: 1.5,
                      "&.Mui-selected": {
                        background: "rgba(59, 130, 246, 0.15)",
                        color: "primary.light",
                      },
                    },
                  }}
                >
                  <ToggleButton
                    value="vertical"
                    aria-label="switch to vertical format"
                    title="Vertical format"
                  >
                    ↓
                  </ToggleButton>
                  <ToggleButton
                    value="horizontal"
                    aria-label="switch to horizontal format"
                    title="Horizontal format"
                  >
                    →
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Typography variant="caption" color="text.secondary">
                Press Enter to submit
              </Typography>
            </Box>
          )}

          {/* ================================================================
               RESULTS PHASE
          ================================================================ */}
          {phase === "results" && (
            <ResultsPanel
              correct={correct}
              attempted={attempted}
              history={history}
              onPlayAgain={startGame}
              onChangeSettings={() => setPhase("setup")}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}
