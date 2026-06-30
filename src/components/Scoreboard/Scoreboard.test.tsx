import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Scoreboard from "./Scoreboard";
import type { ScoreItem } from "./Scoreboard";

const twoItems: ScoreItem[] = [
  { label: "correct", value: 7, color: "#22c55e" },
  { label: "wrong", value: 3, color: "#ef4444" },
];

describe("Scoreboard", () => {
  it("has accessible scoreboard container", () => {
    render(<Scoreboard items={twoItems} />);
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });

  it("renders all item values", () => {
    render(<Scoreboard items={twoItems} />);
    expect(screen.getByLabelText("correct count")).toHaveTextContent("7");
    expect(screen.getByLabelText("wrong count")).toHaveTextContent("3");
  });

  it("renders all item labels", () => {
    render(<Scoreboard items={twoItems} />);
    expect(screen.getByText("correct")).toBeInTheDocument();
    expect(screen.getByText("wrong")).toBeInTheDocument();
  });

  it("renders a single item", () => {
    render(<Scoreboard items={[{ label: "score", value: 42 }]} />);
    expect(screen.getByLabelText("score count")).toHaveTextContent("42");
  });

  it("renders string values", () => {
    render(<Scoreboard items={[{ label: "grade", value: "A+" }]} />);
    expect(screen.getByLabelText("grade count")).toHaveTextContent("A+");
  });

  it("renders three items", () => {
    const items: ScoreItem[] = [
      { label: "a", value: 1 },
      { label: "b", value: 2 },
      { label: "c", value: 3 },
    ];
    render(<Scoreboard items={items} />);
    expect(screen.getByLabelText("a count")).toBeInTheDocument();
    expect(screen.getByLabelText("b count")).toBeInTheDocument();
    expect(screen.getByLabelText("c count")).toBeInTheDocument();
  });

  it("renders with size='small' without crashing", () => {
    render(<Scoreboard items={twoItems} size="small" />);
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });

  it("renders with size='large' without crashing", () => {
    render(<Scoreboard items={twoItems} size="large" />);
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });

  it("accepts an sx prop without crashing", () => {
    render(<Scoreboard items={twoItems} sx={{ opacity: 0.5 }} />);
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });

  it("works with items that have no color", () => {
    render(<Scoreboard items={[{ label: "total", value: 10 }]} />);
    expect(screen.getByLabelText("total count")).toHaveTextContent("10");
  });

  it("updates when items change", () => {
    const { rerender } = render(
      <Scoreboard items={[{ label: "score", value: 5 }]} />,
    );
    expect(screen.getByLabelText("score count")).toHaveTextContent("5");

    rerender(<Scoreboard items={[{ label: "score", value: 9 }]} />);
    expect(screen.getByLabelText("score count")).toHaveTextContent("9");
  });

  it("renders an empty items array without crashing", () => {
    render(<Scoreboard items={[]} />);
    expect(screen.getByLabelText("scoreboard")).toBeInTheDocument();
  });
});
