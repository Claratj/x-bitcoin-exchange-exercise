import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BuySellToggle } from "./BuySellToggle";
import "@testing-library/jest-dom/vitest";

describe("BuySellToggle", () => {
  const defaultProps = {
    mode: "buy" as const,
    onToggle: vi.fn(),
  };

  it("renders in buy mode by default", () => {
    render(<BuySellToggle {...defaultProps} />);
    const checkbox = screen.getByRole("switch");
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute("aria-label", "Exchange mode: buy");
  });

  it("renders in sell mode", () => {
    render(<BuySellToggle {...defaultProps} mode="sell" />);
    const checkbox = screen.getByRole("switch");
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute("aria-label", "Exchange mode: sell");
  });

  it("calls onToggle when clicked", () => {
    render(<BuySellToggle {...defaultProps} />);
    const checkbox = screen.getByRole("switch");
    fireEvent.click(checkbox);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA attributes", () => {
    render(<BuySellToggle {...defaultProps} />);
    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "Exchange mode selection"
    );
    const checkbox = screen.getByRole("switch");
    expect(checkbox).toHaveAttribute("aria-checked", "true");
  });

  it("has correct visual elements", () => {
    render(<BuySellToggle {...defaultProps} />);
    const slider = screen
      .getByRole("region")
      .querySelector('.slider[aria-hidden="true"]');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveClass("slider");
    expect(slider).toHaveAttribute("aria-hidden", "true");
  });
});
