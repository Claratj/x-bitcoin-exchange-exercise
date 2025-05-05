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
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveAttribute("aria-label", "Exchange mode: buy");
  });

  it("renders in sell mode when mode prop is sell", () => {
    render(<BuySellToggle {...defaultProps} mode="sell" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("aria-label", "Exchange mode: sell");
  });

  it("calls onToggle when clicked", () => {
    render(<BuySellToggle {...defaultProps} />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    expect(defaultProps.onToggle).toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<BuySellToggle {...defaultProps} />);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("aria-label", "Exchange mode selection");

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("type", "checkbox");
    expect(toggle).toHaveAttribute("aria-checked", "true");
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
