import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimerArc from "./TimerArc";

describe("TimerArc", () => {
  it("renders the seconds remaining", () => {
    render(<TimerArc secondsLeft={45} totalSeconds={60} />);
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("has timer role", () => {
    render(<TimerArc secondsLeft={30} totalSeconds={60} />);
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(<TimerArc secondsLeft={30} totalSeconds={60} />);
    expect(screen.getByRole("timer")).toHaveAttribute(
      "aria-label",
      "30 seconds remaining",
    );
  });

  it("aria-label updates when secondsLeft changes", () => {
    const { rerender } = render(
      <TimerArc secondsLeft={10} totalSeconds={60} />,
    );
    expect(screen.getByRole("timer")).toHaveAttribute(
      "aria-label",
      "10 seconds remaining",
    );
    rerender(<TimerArc secondsLeft={5} totalSeconds={60} />);
    expect(screen.getByRole("timer")).toHaveAttribute(
      "aria-label",
      "5 seconds remaining",
    );
  });

  it("displays 0 when time is up", () => {
    render(<TimerArc secondsLeft={0} totalSeconds={60} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders without crashing when totalSeconds is 0", () => {
    render(<TimerArc secondsLeft={0} totalSeconds={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("accepts a custom size prop", () => {
    render(<TimerArc secondsLeft={30} totalSeconds={60} size={80} />);
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("accepts a custom color prop", () => {
    render(<TimerArc secondsLeft={30} totalSeconds={60} color="#ff00ff" />);
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("accepts an sx prop without crashing", () => {
    render(
      <TimerArc secondsLeft={30} totalSeconds={60} sx={{ opacity: 0.5 }} />,
    );
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });
});
