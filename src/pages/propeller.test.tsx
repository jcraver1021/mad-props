import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropellerPage from "./propeller";

function renderPage() {
  return render(
    <MemoryRouter>
      <PropellerPage />
    </MemoryRouter>,
  );
}

describe("Propeller Page", () => {
  it("renders the propeller title", () => {
    renderPage();
    expect(screen.getByText("Propeller")).toBeInTheDocument();
  });

  it("renders a home link", () => {
    renderPage();
    expect(screen.getByText("← Home")).toBeInTheDocument();
  });

  it("starts at 120 RPM", () => {
    renderPage();
    expect(screen.getByText("Speed — 120 RPM")).toBeInTheDocument();
  });

  it("starts with 3 blades", () => {
    renderPage();
    expect(screen.getByText("Blades — 3")).toBeInTheDocument();
  });

  it("starts spinning clockwise", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "Clockwise" })).toHaveClass(
      "Mui-selected",
    );
  });

  it("updates the speed label when the speed slider changes", () => {
    renderPage();
    const slider = screen.getByLabelText("Propeller speed");
    slider.focus();
    fireEventChange(slider, 300);
    expect(screen.getByText("Speed — 300 RPM")).toBeInTheDocument();
  });

  it("updates the blade count label and blade count when the slider changes", () => {
    const { container } = renderPage();
    const slider = screen.getByLabelText("Blade count");
    slider.focus();
    fireEventChange(slider, 8);
    expect(screen.getByText("Blades — 8")).toBeInTheDocument();
    expect(container.querySelectorAll("ellipse")).toHaveLength(8);
  });

  it("switches to counterclockwise when clicked", () => {
    renderPage();
    const ccwButton = screen.getByRole("button", {
      name: "Counterclockwise",
    });
    fireEvent.click(ccwButton);
    expect(ccwButton).toHaveClass("Mui-selected");
    expect(screen.getByRole("button", { name: "Clockwise" })).not.toHaveClass(
      "Mui-selected",
    );
  });

  it("passes the current rpm to the propeller's aria-label", () => {
    renderPage();
    expect(
      screen.getByRole("img", {
        name: "Propeller spinning at 120 RPM",
      }),
    ).toBeInTheDocument();
  });
});

function fireEventChange(slider: HTMLElement, value: number) {
  const input = slider as HTMLInputElement;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  nativeInputValueSetter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
