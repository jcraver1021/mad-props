import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResultsPanel from "./ResultsPanel";
import type { ProblemHistoryEntry } from "./types";

const noHistory: ProblemHistoryEntry[] = [];

const sampleHistory: ProblemHistoryEntry[] = [
  { problem: { a: 5, b: 3, op: "+", answer: 8 }, userAnswer: 8, ok: true },
  { problem: { a: 9, b: 4, op: "−", answer: 5 }, userAnswer: 3, ok: false },
  { problem: { a: 6, b: 7, op: "×", answer: 42 }, userAnswer: 42, ok: true },
];

describe("ResultsPanel", () => {
  it("renders the results panel", () => {
    render(
      <ResultsPanel
        correct={5}
        attempted={8}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("results panel")).toBeInTheDocument();
  });

  it("shows 'Time's up!'", () => {
    render(
      <ResultsPanel
        correct={5}
        attempted={8}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByText("Time's up!")).toBeInTheDocument();
  });

  it("renders a Scoreboard with correct and attempted counts", () => {
    render(
      <ResultsPanel
        correct={7}
        attempted={10}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    // The generic Scoreboard uses '{label} count' aria-labels
    expect(screen.getByLabelText("correct count")).toHaveTextContent("7");
    expect(screen.getByLabelText("attempted count")).toHaveTextContent("10");
  });

  it("shows accuracy when attempted > 0", () => {
    render(
      <ResultsPanel
        correct={8}
        attempted={10}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("accuracy")).toHaveTextContent("80%");
  });

  it("hides accuracy when attempted is 0", () => {
    render(
      <ResultsPanel
        correct={0}
        attempted={0}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.queryByLabelText("accuracy")).not.toBeInTheDocument();
  });

  it("shows encouragement message", () => {
    render(
      <ResultsPanel
        correct={5}
        attempted={5}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("encouragement message")).toBeInTheDocument();
  });

  it("shows 'Keep practicing!' when correct is 0", () => {
    render(
      <ResultsPanel
        correct={0}
        attempted={3}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByText("Keep practicing!")).toBeInTheDocument();
  });

  it("shows math wizard message for 30+ correct", () => {
    render(
      <ResultsPanel
        correct={30}
        attempted={30}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByText(/Math wizard/i)).toBeInTheDocument();
  });

  it("renders problem history when present", () => {
    render(
      <ResultsPanel
        correct={2}
        attempted={3}
        history={sampleHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("problem history")).toBeInTheDocument();
  });

  it("does not render history section when empty", () => {
    render(
      <ResultsPanel
        correct={0}
        attempted={0}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.queryByLabelText("problem history")).not.toBeInTheDocument();
  });

  it("shows correct problems in history", () => {
    render(
      <ResultsPanel
        correct={2}
        attempted={3}
        history={sampleHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByText(/5 \+ 3/)).toBeInTheDocument();
  });

  it("shows wrong answers with user's answer", () => {
    render(
      <ResultsPanel
        correct={2}
        attempted={3}
        history={sampleHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByText(/you: 3/)).toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again is clicked", () => {
    const onPlayAgain = vi.fn();
    render(
      <ResultsPanel
        correct={5}
        attempted={5}
        history={noHistory}
        onPlayAgain={onPlayAgain}
        onChangeSettings={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Play Again"));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("calls onChangeSettings when Change Settings is clicked", () => {
    const onChangeSettings = vi.fn();
    render(
      <ResultsPanel
        correct={5}
        attempted={5}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={onChangeSettings}
      />,
    );
    fireEvent.click(screen.getByText("Change Settings"));
    expect(onChangeSettings).toHaveBeenCalledTimes(1);
  });

  it("renders the embedded Scoreboard component", () => {
    render(
      <ResultsPanel
        correct={3}
        attempted={5}
        history={noHistory}
        onPlayAgain={vi.fn()}
        onChangeSettings={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });
});
