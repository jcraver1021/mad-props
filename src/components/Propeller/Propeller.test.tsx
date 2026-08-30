import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Propeller from "./Propeller";

describe("Propeller", () => {
  let rafCallbacks: FrameRequestCallback[] = [];

  beforeEach(() => {
    rafCallbacks = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Swap out the array before invoking so callbacks re-scheduling
  // themselves (as the component's loop does) land in the next tick.
  const tick = (ts: number) => {
    const pending = rafCallbacks;
    rafCallbacks = [];
    pending.forEach((cb) => cb(ts));
  };

  it("renders an svg with an img role", () => {
    render(<Propeller rpm={120} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("includes the rpm in the aria-label", () => {
    render(<Propeller rpm={120} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Propeller spinning at 120 RPM",
    );
  });

  it("renders 3 blades by default", () => {
    const { container } = render(<Propeller rpm={0} />);
    expect(container.querySelectorAll("ellipse")).toHaveLength(3);
  });

  it("renders the requested number of blades", () => {
    const { container } = render(<Propeller rpm={0} bladeCount={8} />);
    expect(container.querySelectorAll("ellipse")).toHaveLength(8);
  });

  it("supports a single blade", () => {
    const { container } = render(<Propeller rpm={0} bladeCount={1} />);
    expect(container.querySelectorAll("ellipse")).toHaveLength(1);
  });

  it("uses the requested size for the svg", () => {
    const { container } = render(<Propeller rpm={0} size={100} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "100");
  });

  it("does not rotate when rpm is 0", () => {
    const { container } = render(<Propeller rpm={0} />);
    // First tick must be nonzero: it only establishes a baseline timestamp,
    // and 0 would be indistinguishable from the ref's initial unset value.
    tick(16);
    tick(516);
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "rotate(0 100 100)",
    );
  });

  it("rotates clockwise by default", () => {
    const { container } = render(<Propeller rpm={60} />);
    tick(16);
    tick(516); // 0.5s at 60rpm * 6deg/rpm/s = 180deg
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "rotate(180 100 100)",
    );
  });

  it("rotates counterclockwise when direction is ccw", () => {
    const { container } = render(<Propeller rpm={60} direction="ccw" />);
    tick(16);
    tick(516);
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "rotate(-180 100 100)",
    );
  });

  it("picks up rpm changes on an in-flight animation", () => {
    const { container, rerender } = render(<Propeller rpm={60} />);
    tick(16);
    tick(516); // angle = 180
    rerender(<Propeller rpm={90} />);
    tick(1016); // 180 + (0.5s * 90rpm * 6deg/rpm/s) = 450 % 360 = 90
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "rotate(90 100 100)",
    );
  });

  it("picks up direction changes on an in-flight animation", () => {
    const { container, rerender } = render(<Propeller rpm={60} />);
    tick(16);
    tick(516); // angle = 180
    rerender(<Propeller rpm={60} direction="ccw" />);
    tick(1016); // 180 - (0.5s * 60rpm * 6deg/rpm/s) = 0
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "rotate(0 100 100)",
    );
  });

  it("cancels the animation frame on unmount", () => {
    const { unmount } = render(<Propeller rpm={60} />);
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
