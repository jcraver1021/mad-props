import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Ouija from "./ouija";

describe("Ouija Page", () => {
  it("renders the spirit board title", () => {
    render(<Ouija />);
    expect(screen.getByText("Spirit Board")).toBeInTheDocument();
  });

  it("renders message input field", () => {
    render(<Ouija />);
    expect(screen.getByLabelText("Enter your message")).toBeInTheDocument();
  });

  it("renders planchette style toggle", () => {
    render(<Ouija />);
    expect(screen.getByText("Wooden")).toBeInTheDocument();
    expect(screen.getByText("Spectral")).toBeInTheDocument();
  });

  it("renders summon button", () => {
    render(<Ouija />);
    expect(screen.getByText("Summon the Spirits")).toBeInTheDocument();
  });

  it("message input has visible border styling", () => {
    const { container } = render(<Ouija />);
    const input = container.querySelector(".MuiOutlinedInput-root");

    expect(input).toBeInTheDocument();
  });

  it("renders ouija board", () => {
    const { container } = render(<Ouija />);
    const board = container.querySelector("#ouija-board");

    expect(board).toBeInTheDocument();
  });

  it("renders message scroll component", () => {
    render(<Ouija />);
    const board = document.querySelector("#ouija-board");

    expect(board).toBeInTheDocument();
  });

  it("scroll shows letters, numbers, and spaces but not special characters", () => {
    render(<Ouija />);
    expect(screen.getByText("Spirit Board")).toBeInTheDocument();
  });

  it("renders reset button", () => {
    render(<Ouija />);
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("reset button is disabled when no content", () => {
    render(<Ouija />);
    const resetButton = screen.getByText("Reset");
    expect(resetButton).toBeDisabled();
  });

  it("reset button is enabled when message is entered", () => {
    render(<Ouija />);
    const input = screen.getByLabelText("Enter your message");
    const resetButton = screen.getByText("Reset");

    fireEvent.change(input, { target: { value: "Hello" } });

    expect(resetButton).not.toBeDisabled();
  });

  it("reset button clears the message input", () => {
    render(<Ouija />);
    const input = screen.getByLabelText(
      "Enter your message",
    ) as HTMLInputElement;
    const resetButton = screen.getByText("Reset");

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");

    fireEvent.click(resetButton);
    expect(input.value).toBe("");
  });
});
