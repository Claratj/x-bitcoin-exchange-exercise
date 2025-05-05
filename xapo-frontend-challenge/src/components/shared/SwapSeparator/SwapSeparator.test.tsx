import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SwapSeparator } from "./SwapSeparator";
import "@testing-library/jest-dom/vitest";

describe("SwapSeparator", () => {
  it("renders the button with correct aria-label", () => {
    render(<SwapSeparator />);
    const button = screen.getByRole("button", { name: "Swap input order" });
    expect(button).toBeInTheDocument();
  });

  it("renders the SVG arrows", () => {
    render(<SwapSeparator />);
    const svg = screen
      .getByRole("button", { name: "Swap input order" })
      .querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg?.className.baseVal).toContain("swap-arrows");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<SwapSeparator onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Swap input order" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
