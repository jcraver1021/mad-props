import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GameSettings, { estimateGrade } from "./GameSettings";
import type { GameSettings as GameSettingsType } from "./types";

const base: GameSettingsType = {
  ops: ["+"],
  maxOperand: 10,
  allowNegative: false,
};

describe("GameSettings – operations", () => {
  it("renders all four operation chips", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("toggle +")).toBeInTheDocument();
    expect(screen.getByLabelText("toggle −")).toBeInTheDocument();
    expect(screen.getByLabelText("toggle ×")).toBeInTheDocument();
    expect(screen.getByLabelText("toggle ÷")).toBeInTheDocument();
  });

  it("marks active operation as pressed", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("toggle +")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText("toggle −")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("calls onChange when an inactive op is clicked", () => {
    const onChange = vi.fn();
    render(<GameSettings settings={base} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("toggle −"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ ops: expect.arrayContaining(["+", "−"]) }),
    );
  });

  it("calls onChange to deselect an active op", () => {
    const onChange = vi.fn();
    const settings: GameSettingsType = {
      ops: ["+", "−"],
      maxOperand: 10,
      allowNegative: false,
    };
    render(<GameSettings settings={settings} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("toggle −"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ ops: ["+"] }),
    );
  });

  it("does not call onChange if the only op would be removed", () => {
    const onChange = vi.fn();
    render(<GameSettings settings={base} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("toggle +"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows multiple ops as pressed", () => {
    const settings: GameSettingsType = {
      ops: ["+", "×"],
      maxOperand: 10,
      allowNegative: false,
    };
    render(<GameSettings settings={settings} onChange={vi.fn()} />);
    expect(screen.getByLabelText("toggle +")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText("toggle ×")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByLabelText("toggle −")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("GameSettings – negative numbers", () => {
  it("renders the negative numbers toggle", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("allow negative answers")).toBeInTheDocument();
  });

  it("toggle is unchecked when allowNegative=false", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("allow negative answers")).not.toBeChecked();
  });

  it("toggle is checked when allowNegative=true", () => {
    const settings: GameSettingsType = { ...base, allowNegative: true };
    render(<GameSettings settings={settings} onChange={vi.fn()} />);
    expect(screen.getByLabelText("allow negative answers")).toBeChecked();
  });

  it("calls onChange with allowNegative=true when toggled on", () => {
    const onChange = vi.fn();
    render(<GameSettings settings={base} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("allow negative answers"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ allowNegative: true }),
    );
  });

  it("calls onChange with allowNegative=false when toggled off", () => {
    const onChange = vi.fn();
    const settings: GameSettingsType = { ...base, allowNegative: true };
    render(<GameSettings settings={settings} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("allow negative answers"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ allowNegative: false }),
    );
  });

  it("shows example of negative result", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByText(/3 − 7 = −4/)).toBeInTheDocument();
  });
});

describe("GameSettings – grade estimator", () => {
  it("renders the grade estimate container", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("grade estimate")).toBeInTheDocument();
  });

  it("shows Grade 1 for + only, max 10", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByText("Grade 1")).toBeInTheDocument();
  });

  it("shows Grade 3 for × only, max 10", () => {
    const settings: GameSettingsType = {
      ops: ["×"],
      maxOperand: 10,
      allowNegative: false,
    };
    render(<GameSettings settings={settings} onChange={vi.fn()} />);
    expect(screen.getByText("Grade 3")).toBeInTheDocument();
  });

  it("shows Grade 6+ when allowNegative is true", () => {
    const settings: GameSettingsType = { ...base, allowNegative: true };
    render(<GameSettings settings={settings} onChange={vi.fn()} />);
    expect(screen.getByText("Grade 6+")).toBeInTheDocument();
  });

  it("shows 'Estimated level:' label", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByText("Estimated level:")).toBeInTheDocument();
  });
});

describe("GameSettings – slider", () => {
  it("renders the max operand slider", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("maximum operand")).toBeInTheDocument();
  });

  it("renders max number value", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    // The value "10" appears in the label
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });
});

describe("GameSettings – accessible container", () => {
  it("has game settings aria-label", () => {
    render(<GameSettings settings={base} onChange={vi.fn()} />);
    expect(screen.getByLabelText("game settings")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// estimateGrade – unit tests
// ---------------------------------------------------------------------------

describe("estimateGrade", () => {
  it("returns Grade 6+ when allowNegative is true, regardless of other settings", () => {
    expect(estimateGrade(["+"], 5, true)).toBe("Grade 6+");
    expect(estimateGrade(["×", "÷"], 100, true)).toBe("Grade 6+");
    expect(estimateGrade(["+", "−", "×", "÷"], 10, true)).toBe("Grade 6+");
  });

  it("addition only, max 10 → Grade 1", () => {
    expect(estimateGrade(["+"], 10)).toBe("Grade 1");
  });

  it("addition + subtraction, max 10 → Grade 1", () => {
    expect(estimateGrade(["+", "−"], 10)).toBe("Grade 1");
  });

  it("addition only, max 20 → Grade 2", () => {
    expect(estimateGrade(["+"], 20)).toBe("Grade 2");
  });

  it("subtraction only, max 20 → Grade 2", () => {
    expect(estimateGrade(["−"], 20)).toBe("Grade 2");
  });

  it("addition only, max 50 → Grade 3", () => {
    expect(estimateGrade(["+"], 50)).toBe("Grade 3");
  });

  it("multiplication only, max 10 → Grade 3", () => {
    expect(estimateGrade(["×"], 10)).toBe("Grade 3");
  });

  it("multiplication only, max 12 → Grade 4", () => {
    expect(estimateGrade(["×"], 12)).toBe("Grade 4");
  });

  it("division only, max 12 → Grade 4", () => {
    expect(estimateGrade(["÷"], 12)).toBe("Grade 4");
  });

  it("multiplication + division, max 12 → Grade 4", () => {
    expect(estimateGrade(["×", "÷"], 12)).toBe("Grade 4");
  });

  it("division only, large numbers → Grade 5", () => {
    expect(estimateGrade(["÷"], 50)).toBe("Grade 5");
  });

  it("mixed with multiplication, small numbers → Grade 4–5", () => {
    expect(estimateGrade(["+", "×"], 10)).toBe("Grade 4–5");
  });

  it("all ops, large numbers → Grade 5+", () => {
    expect(estimateGrade(["+", "−", "×", "÷"], 50)).toBe("Grade 5+");
  });

  it("defaults allowNegative to false", () => {
    expect(estimateGrade(["+"], 10)).toBe("Grade 1");
  });
});
