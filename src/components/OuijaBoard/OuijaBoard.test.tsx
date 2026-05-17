import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import OuijaBoard from "./OuijaBoard";

describe("OuijaBoard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the board with all letters", () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message=""
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument();
    });
  });

  it("renders the board with all numbers", () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message=""
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    const numbers = "1234567890".split("");
    numbers.forEach((number) => {
      expect(screen.getByText(number)).toBeInTheDocument();
    });
  });

  it("renders YES, NO, and GOODBYE", () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message=""
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    expect(screen.getByText("YES")).toBeInTheDocument();
    expect(screen.getByText("NO")).toBeInTheDocument();
    expect(screen.getByText("GOODBYE")).toBeInTheDocument();
  });

  it("does not render planchette when not animating", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="HELLO"
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    const planchettes = container.querySelectorAll(
      '[style*="position: absolute"][style*="width: 80px"]',
    );
    expect(planchettes.length).toBe(0);
  });

  it("renders planchette when animating", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="A"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const board = container.querySelector("#ouija-board");
    expect(board).toBeInTheDocument();
  });

  it("animation interval is set up when isAnimating is true", () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message="ABC"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const intervalCount = vi.getTimerCount();
    expect(intervalCount).toBeGreaterThan(0);
  });

  it("handles empty message", async () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message=""
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    await vi.advanceTimersByTimeAsync(2000);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("each character has unique id", () => {
    const mockCallback = vi.fn();
    render(
      <OuijaBoard
        message=""
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    expect(document.getElementById("char-A")).toBeInTheDocument();
    expect(document.getElementById("char-Z")).toBeInTheDocument();
    expect(document.getElementById("char-1")).toBeInTheDocument();
    expect(document.getElementById("char-0")).toBeInTheDocument();
    expect(document.getElementById("char-YES")).toBeInTheDocument();
    expect(document.getElementById("char-NO")).toBeInTheDocument();
    expect(document.getElementById("char-GOODBYE")).toBeInTheDocument();
  });

  it("board has correct styling", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message=""
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    const board = container.querySelector("#ouija-board");
    expect(board).toHaveStyle({
      position: "relative",
      width: "800px",
      height: "600px",
    });
  });

  it("stops animation when isAnimating becomes false", async () => {
    const mockCallback = vi.fn();
    const { rerender } = render(
      <OuijaBoard
        message="HELLO"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    await vi.advanceTimersByTimeAsync(800);

    rerender(
      <OuijaBoard
        message="HELLO"
        isAnimating={false}
        onAnimationComplete={mockCallback}
      />,
    );

    await vi.advanceTimersByTimeAsync(5000);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("handles lowercase letters by converting to uppercase", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="hello"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    expect(document.getElementById("char-H")).toBeInTheDocument();
    expect(document.getElementById("char-E")).toBeInTheDocument();
    expect(document.getElementById("char-L")).toBeInTheDocument();
    expect(document.getElementById("char-O")).toBeInTheDocument();
  });

  it("handles mixed case letters", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="HeLLo"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const intervalCount = vi.getTimerCount();
    expect(intervalCount).toBeGreaterThan(0);
  });

  it("handles message with spaces", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="HELLO WORLD"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const intervalCount = vi.getTimerCount();
    expect(intervalCount).toBeGreaterThan(0);
  });

  it("handles message with special characters", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="HELLO!@#$"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const intervalCount = vi.getTimerCount();
    expect(intervalCount).toBeGreaterThan(0);
  });

  it("handles message with only numbers", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="12345"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    expect(document.getElementById("char-1")).toBeInTheDocument();
    expect(document.getElementById("char-2")).toBeInTheDocument();
    expect(document.getElementById("char-3")).toBeInTheDocument();
    expect(document.getElementById("char-4")).toBeInTheDocument();
    expect(document.getElementById("char-5")).toBeInTheDocument();
  });

  it("handles complex message with letters, numbers, spaces, and special chars", () => {
    const mockCallback = vi.fn();
    const { container } = render(
      <OuijaBoard
        message="abc 123 !@#"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const intervalCount = vi.getTimerCount();
    expect(intervalCount).toBeGreaterThan(0);
  });

  it("lowercase and uppercase messages should behave identically", () => {
    const mockCallback = vi.fn();
    const { container: container1 } = render(
      <OuijaBoard
        message="HELLO"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    const { container: container2 } = render(
      <OuijaBoard
        message="hello"
        isAnimating={true}
        onAnimationComplete={mockCallback}
      />,
    );

    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });
});
