import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Planchette from "./Planchette";

describe("Planchette", () => {
  it("renders at specified position", () => {
    const { container } = render(<Planchette x={100} y={200} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toBeInTheDocument();
    expect(planchette).toHaveStyle({
      left: "100px",
      top: "200px",
    });
  });

  it("renders with transform to center itself", () => {
    const { container } = render(<Planchette x={50} y={75} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toHaveStyle({
      transform: "translate(-50%, -50%)",
    });
  });

  it("has correct dimensions", () => {
    const { container } = render(<Planchette x={0} y={0} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toHaveStyle({
      width: "100px",
      height: "100px",
    });
  });

  it("is positioned absolutely", () => {
    const { container } = render(<Planchette x={0} y={0} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toHaveStyle({
      position: "absolute",
    });
  });

  it("has smooth transition", () => {
    const { container } = render(<Planchette x={0} y={0} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toHaveStyle({
      transition: "all 0.6s ease-in-out",
    });
  });

  it("updates position when props change", () => {
    const { container, rerender } = render(<Planchette x={10} y={20} />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toHaveStyle({
      left: "10px",
      top: "20px",
    });

    rerender(<Planchette x={150} y={250} />);

    expect(planchette).toHaveStyle({
      left: "150px",
      top: "250px",
    });
  });

  it("has viewing hole centered on the planchette", () => {
    const { container } = render(<Planchette x={100} y={100} />);
    const planchette = container.firstChild as HTMLElement;
    const viewingHole = planchette.querySelector(
      "div > div:nth-child(2)",
    ) as HTMLElement;

    expect(viewingHole).toBeInTheDocument();
    expect(viewingHole).toHaveStyle({
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    });
  });

  it("has viewing hole large enough to display letters", () => {
    const { container } = render(<Planchette x={100} y={100} />);
    const planchette = container.firstChild as HTMLElement;
    const viewingHole = planchette.querySelector(
      "div > div:nth-child(2)",
    ) as HTMLElement;

    expect(viewingHole).toHaveStyle({
      width: "56px",
      height: "56px",
    });
  });

  it("renders planchette body and viewing hole", () => {
    const { container } = render(<Planchette x={100} y={100} />);
    const planchette = container.firstChild as HTMLElement;
    const body = planchette.querySelector(
      "div > div:nth-child(1)",
    ) as HTMLElement;
    const viewingHole = planchette.querySelector(
      "div > div:nth-child(2)",
    ) as HTMLElement;

    expect(body).toBeInTheDocument();
    expect(viewingHole).toBeInTheDocument();
  });

  it("accepts wooden style prop", () => {
    const { container } = render(<Planchette x={100} y={100} style="wooden" />);
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toBeInTheDocument();
    expect(planchette).toHaveStyle({
      width: "100px",
      height: "100px",
    });
  });

  it("accepts spectral style prop", () => {
    const { container } = render(
      <Planchette x={100} y={100} style="spectral" />,
    );
    const planchette = container.firstChild as HTMLElement;

    expect(planchette).toBeInTheDocument();
    expect(planchette).toHaveStyle({
      width: "100px",
      height: "100px",
    });
  });
});
