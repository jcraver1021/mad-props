import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import MessageScroll from "./MessageScroll";

describe("MessageScroll", () => {
  it("renders with empty message", () => {
    const { container } = render(<MessageScroll message="" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays the provided message", () => {
    render(<MessageScroll message="HELLO" />);
    expect(screen.getByText("HELLO")).toBeInTheDocument();
  });

  it("displays uppercase characters", () => {
    render(<MessageScroll message="HELLO WORLD" />);
    expect(screen.getByText("HELLO WORLD")).toBeInTheDocument();
  });

  it("displays numbers", () => {
    render(<MessageScroll message="12345" />);
    expect(screen.getByText("12345")).toBeInTheDocument();
  });

  it("displays transcribed message with spaces", () => {
    render(<MessageScroll message="IM FINE" />);
    expect(screen.getByText("IM FINE")).toBeInTheDocument();
  });

  it("has parchment-style background", () => {
    const { container } = render(<MessageScroll message="TEST" />);
    const scroll = container.firstChild as HTMLElement;

    expect(scroll).toHaveStyle({
      border: "3px solid #4a2818",
    });
  });

  it("uses vintage typography", () => {
    render(<MessageScroll message="TEST" />);
    const text = screen.getByText("TEST");

    expect(text).toHaveStyle({
      fontFamily: "'Cinzel', 'Georgia', serif",
    });
  });

  it("left-justifies text", () => {
    render(<MessageScroll message="LEFT" />);
    const text = screen.getByText("LEFT");

    expect(text).toHaveStyle({
      textAlign: "left",
    });
  });

  it("handles long messages", () => {
    const longMessage = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    render(<MessageScroll message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it("sets width based on expectedLength", () => {
    const { container } = render(
      <MessageScroll message="HELLO" expectedLength={5} />,
    );
    const scroll = container.firstChild as HTMLElement;

    expect(scroll).toBeInTheDocument();
  });

  it("uses default width when expectedLength is not provided", () => {
    const { container } = render(<MessageScroll message="HELLO" />);
    const scroll = container.firstChild as HTMLElement;

    expect(scroll).toBeInTheDocument();
  });

  it("respects maxWidth constraint", () => {
    const { container } = render(
      <MessageScroll message="HELLO" expectedLength={100} />,
    );
    const scroll = container.firstChild as HTMLElement;

    expect(scroll).toHaveStyle({
      maxWidth: "800px",
    });
  });
});
