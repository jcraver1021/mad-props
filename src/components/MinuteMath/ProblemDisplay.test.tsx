import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProblemDisplay from "./ProblemDisplay";
import type { Problem } from "./types";

const addProblem: Problem = { a: 5, b: 3, op: "+", answer: 8 };
const subProblem: Problem = { a: 9, b: 4, op: "−", answer: 5 };
const mulProblem: Problem = { a: 6, b: 7, op: "×", answer: 42 };
const divProblem: Problem = { a: 12, b: 3, op: "÷", answer: 4 };

describe("ProblemDisplay – horizontal format", () => {
  it("renders the problem display container", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });

  it("has data-format='horizontal'", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("problem display")).toHaveAttribute(
      "data-format",
      "horizontal",
    );
  });

  it("renders both operands and the operator", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("=")).toBeInTheDocument();
  });

  it("renders the answer input", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("answer input")).toBeInTheDocument();
  });

  it("answer input shows the current value", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input="8"
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("answer input")).toHaveValue("8");
  });

  it("calls onChange when the input changes", () => {
    const onChange = vi.fn();
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={onChange}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    fireEvent.change(screen.getByLabelText("answer input"), {
      target: { value: "8" },
    });
    expect(onChange).toHaveBeenCalledWith("8");
  });

  it("calls onSubmit when Enter is pressed", () => {
    const onSubmit = vi.fn();
    render(
      <ProblemDisplay
        problem={addProblem}
        input="8"
        onChange={vi.fn()}
        onSubmit={onSubmit}
        format="horizontal"
        flash={null}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText("answer input"), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not call onSubmit for other keys", () => {
    const onSubmit = vi.fn();
    render(
      <ProblemDisplay
        problem={addProblem}
        input="8"
        onChange={vi.fn()}
        onSubmit={onSubmit}
        format="horizontal"
        flash={null}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText("answer input"), { key: "a" });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("strips non-numeric characters from input", () => {
    const onChange = vi.fn();
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={onChange}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    fireEvent.change(screen.getByLabelText("answer input"), {
      target: { value: "abc8!" },
    });
    expect(onChange).toHaveBeenCalledWith("8");
  });

  it("works with subtraction operator", () => {
    render(
      <ProblemDisplay
        problem={subProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("−")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("works with multiplication operator", () => {
    render(
      <ProblemDisplay
        problem={mulProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("works with division operator", () => {
    render(
      <ProblemDisplay
        problem={divProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByText("÷")).toBeInTheDocument();
  });
});

describe("ProblemDisplay – vertical format", () => {
  it("has data-format='vertical'", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="vertical"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("problem display")).toHaveAttribute(
      "data-format",
      "vertical",
    );
  });

  it("renders both operands and operator in vertical mode", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="vertical"
        flash={null}
      />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders the answer input in vertical mode", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="vertical"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("answer input")).toBeInTheDocument();
  });

  it("does NOT render '=' sign in vertical mode", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="vertical"
        flash={null}
      />,
    );
    expect(screen.queryByText("=")).not.toBeInTheDocument();
  });

  it("submits on Enter in vertical mode", () => {
    const onSubmit = vi.fn();
    render(
      <ProblemDisplay
        problem={addProblem}
        input="8"
        onChange={vi.fn()}
        onSubmit={onSubmit}
        format="vertical"
        flash={null}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText("answer input"), { key: "Enter" });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe("ProblemDisplay – flash states", () => {
  it("renders without crashing with flash=correct", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input="8"
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash="correct"
      />,
    );
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });

  it("renders without crashing with flash=wrong", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input="5"
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash="wrong"
      />,
    );
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });

  it("renders without crashing with flash=null", () => {
    render(
      <ProblemDisplay
        problem={addProblem}
        input=""
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        format="horizontal"
        flash={null}
      />,
    );
    expect(screen.getByLabelText("problem display")).toBeInTheDocument();
  });
});
