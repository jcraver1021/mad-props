import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import MinuteMath, { generateProblem } from "./minute-math";
import type { GameSettings, Op } from "../components/MinuteMath/types";

describe("MinuteMath page – setup phase", () => {
  it("renders the page title", () => {
    render(<MinuteMath />);
    expect(
      screen.getByRole("heading", { name: /Minute Math/i }),
    ).toBeInTheDocument();
  });

  it("starts in setup phase by default", () => {
    render(<MinuteMath />);
    expect(
      screen.getByText(/Solve as many problems as you can/i),
    ).toBeInTheDocument();
  });

  it("renders the game settings panel", () => {
    render(<MinuteMath />);
    expect(screen.getByLabelText("game settings")).toBeInTheDocument();
  });

  it("renders the horizontal/vertical layout toggle", () => {
    render(<MinuteMath />);
    expect(screen.getByLabelText("horizontal format")).toBeInTheDocument();
    expect(screen.getByLabelText("vertical format")).toBeInTheDocument();
  });

  it("renders the Start button", () => {
    render(<MinuteMath />);
    expect(screen.getByText("Start!")).toBeInTheDocument();
  });

  it("grade estimator is visible in setup", () => {
    render(<MinuteMath />);
    expect(screen.getByLabelText("grade estimate")).toBeInTheDocument();
  });
});

describe("MinuteMath page – starting a game", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clicking Start transitions to the playing phase", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("shows the problem display after starting", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });

  it("shows the answer input after starting", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByLabelText("answer input")).toBeInTheDocument();
  });

  it("shows the scoreboard after starting", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });

  it("shows the Submit button after starting", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("timer starts at 60", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByRole("timer")).toHaveAttribute(
      "aria-label",
      "60 seconds remaining",
    );
  });

  it("timer counts down", async () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole("timer")).toHaveAttribute(
      "aria-label",
      "57 seconds remaining",
    );
  });

  it("transitions to results when timer expires", async () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });

    expect(screen.getByLabelText("results panel")).toBeInTheDocument();
  });
});

describe("MinuteMath page – answering problems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function startAndGetProblem() {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    return screen.getByLabelText("answer input");
  }

  it("answering correctly increments the correct count", async () => {
    // Force a predictable problem: 10 + 10 = 20
    vi.spyOn(Math, "random").mockReturnValue(0.9999);
    const input = startAndGetProblem();

    fireEvent.change(input, { target: { value: "20" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // Wait for flash to clear and next problem to load
    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText("correct count")).toHaveTextContent("1");
    vi.restoreAllMocks();
  });

  it("answering incorrectly increments wrong count", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999);
    const input = startAndGetProblem();

    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    // In the playing HUD the second scoreboard item is labelled "wrong"
    expect(screen.getByLabelText("wrong count")).toHaveTextContent("1");
    vi.restoreAllMocks();
  });

  it("Submit button is disabled when input is empty", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByText("Submit")).toBeDisabled();
  });

  it("Submit button is enabled when input has a value", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    fireEvent.change(screen.getByLabelText("answer input"), {
      target: { value: "5" },
    });
    expect(screen.getByText("Submit")).not.toBeDisabled();
  });

  it("clears the input after submission", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const input = startAndGetProblem();

    fireEvent.change(input, { target: { value: "42" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await act(async () => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.getByLabelText("answer input")).toHaveValue("");
    vi.restoreAllMocks();
  });
});

describe("MinuteMath page – results phase", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function playToEnd() {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
  }

  it("shows results panel after time runs out", async () => {
    await playToEnd();
    expect(screen.getByLabelText("results panel")).toBeInTheDocument();
  });

  it("Play Again restarts the game", async () => {
    await playToEnd();
    fireEvent.click(screen.getByText("Play Again"));
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });

  it("Change Settings returns to setup phase", async () => {
    await playToEnd();
    fireEvent.click(screen.getByText("Change Settings"));
    expect(screen.getByText("Start!")).toBeInTheDocument();
  });
});

describe("MinuteMath page – format toggle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to horizontal format", () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    expect(screen.getByLabelText("problem display")).toHaveAttribute(
      "data-format",
      "horizontal",
    );
  });

  it("switching to vertical changes the problem format", async () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    fireEvent.click(screen.getByLabelText("switch to vertical format"));
    expect(screen.getByLabelText("problem display")).toHaveAttribute(
      "data-format",
      "vertical",
    );
  });

  it("switching back to horizontal works", async () => {
    render(<MinuteMath />);
    fireEvent.click(screen.getByText("Start!"));
    fireEvent.click(screen.getByLabelText("switch to vertical format"));
    fireEvent.click(screen.getByLabelText("switch to horizontal format"));
    expect(screen.getByLabelText("problem display")).toHaveAttribute(
      "data-format",
      "horizontal",
    );
  });
});

// ---------------------------------------------------------------------------
// generateProblem – unit tests
// ---------------------------------------------------------------------------

describe("generateProblem – addition", () => {
  const settings: GameSettings = {
    ops: ["+"],
    maxOperand: 10,
    allowNegative: false,
  };

  it("produces the correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem(settings);
      expect(p.answer).toBe(p.a + p.b);
    }
  });

  it("operands are within [1, maxOperand]", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem(settings);
      expect(p.a).toBeGreaterThanOrEqual(1);
      expect(p.a).toBeLessThanOrEqual(10);
      expect(p.b).toBeGreaterThanOrEqual(1);
      expect(p.b).toBeLessThanOrEqual(10);
    }
  });

  it("always uses the + operator", () => {
    for (let i = 0; i < 30; i++) {
      expect(generateProblem(settings).op).toBe("+");
    }
  });
});

describe("generateProblem – subtraction, allowNegative=false", () => {
  const settings: GameSettings = {
    ops: ["−"],
    maxOperand: 20,
    allowNegative: false,
  };

  it("answer is always non-negative", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateProblem(settings).answer).toBeGreaterThanOrEqual(0);
    }
  });

  it("a is always >= b", () => {
    for (let i = 0; i < 100; i++) {
      const p = generateProblem(settings);
      expect(p.a).toBeGreaterThanOrEqual(p.b);
    }
  });

  it("produces the correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem(settings);
      expect(p.answer).toBe(p.a - p.b);
    }
  });
});

describe("generateProblem – subtraction, allowNegative=true", () => {
  const settings: GameSettings = {
    ops: ["−"],
    maxOperand: 10,
    allowNegative: true,
  };

  it("produces the correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem(settings);
      expect(p.answer).toBe(p.a - p.b);
    }
  });

  it("can produce negative answers", () => {
    const answers = Array.from(
      { length: 500 },
      () => generateProblem(settings).answer,
    );
    expect(answers.some((a) => a < 0)).toBe(true);
  });
});

describe("generateProblem – multiplication", () => {
  const settings: GameSettings = {
    ops: ["×"],
    maxOperand: 12,
    allowNegative: false,
  };

  it("produces the correct answer", () => {
    for (let i = 0; i < 50; i++) {
      const p = generateProblem(settings);
      expect(p.answer).toBe(p.a * p.b);
    }
  });
});

describe("generateProblem – division", () => {
  const settings: GameSettings = {
    ops: ["÷"],
    maxOperand: 10,
    allowNegative: false,
  };

  it("answer is always a whole number", () => {
    for (let i = 0; i < 100; i++) {
      expect(Number.isInteger(generateProblem(settings).answer)).toBe(true);
    }
  });

  it("a divided by b equals the answer exactly", () => {
    for (let i = 0; i < 100; i++) {
      const p = generateProblem(settings);
      expect(p.a / p.b).toBe(p.answer);
    }
  });

  it("b is never zero", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateProblem(settings).b).toBeGreaterThan(0);
    }
  });
});

describe("generateProblem – mixed ops", () => {
  it("uses all four operators across many samples", () => {
    const settings: GameSettings = {
      ops: ["+", "−", "×", "÷"],
      maxOperand: 20,
      allowNegative: false,
    };
    const seen = new Set<Op>();
    for (let i = 0; i < 500; i++) seen.add(generateProblem(settings).op);
    expect(seen.has("+")).toBe(true);
    expect(seen.has("−")).toBe(true);
    expect(seen.has("×")).toBe(true);
    expect(seen.has("÷")).toBe(true);
  });

  it("only uses ops from the provided set", () => {
    const allowed = new Set<Op>(["+", "÷"]);
    const settings: GameSettings = {
      ops: ["+", "÷"],
      maxOperand: 10,
      allowNegative: false,
    };
    for (let i = 0; i < 100; i++) {
      expect(allowed.has(generateProblem(settings).op)).toBe(true);
    }
  });
});

describe("generateProblem – determinism via mocked random", () => {
  it("returns predictable problem when random always returns max", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9999);
    const p = generateProblem({
      ops: ["+"],
      maxOperand: 10,
      allowNegative: false,
    });
    expect(p.a).toBe(10);
    expect(p.b).toBe(10);
    expect(p.answer).toBe(20);
    vi.restoreAllMocks();
  });
});
