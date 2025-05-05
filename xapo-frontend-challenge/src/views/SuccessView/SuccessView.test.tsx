import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SuccessView } from "./SuccessView";
import "@testing-library/jest-dom/vitest";

describe("SuccessView", () => {
  const defaultProps = {
    btcValue: "1",
    usdValue: "50000",
    exchangeMode: "buy" as const,
    onReset: vi.fn(),
  };

  it("renders buy success message with correct title and details", () => {
    render(<SuccessView {...defaultProps} />);
    expect(screen.getByText("Purchase Successful!")).toBeInTheDocument();
    expect(
      screen.getByText("You have successfully bought 1 BTC for 50000 USD")
    ).toBeInTheDocument();
  });

  it("renders sell success message with correct title and details", () => {
    render(<SuccessView {...defaultProps} exchangeMode="sell" />);
    expect(screen.getByText("Sale Successful!")).toBeInTheDocument();
    expect(
      screen.getByText("You have successfully sold 1 BTC for 50000 USD")
    ).toBeInTheDocument();
  });

  it("calls onReset when make another swap button is clicked", () => {
    render(<SuccessView {...defaultProps} />);
    const button = screen.getByRole("button", {
      name: /make another transaction/i,
    });
    fireEvent.click(button);
    expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
  });

  it("has correct ARIA attributes for accessibility", () => {
    render(<SuccessView {...defaultProps} />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "polite");
    expect(alert).toHaveAttribute("aria-label", "Transaction successful");
  });

  it("renders with correct structure and classes", () => {
    render(<SuccessView {...defaultProps} />);
    const wrapper = screen.getByRole("alert").parentElement;
    expect(wrapper).toHaveClass("swap-success-wrapper");
    expect(screen.getByRole("alert")).toHaveClass("swap-success");
    expect(screen.getByRole("button")).toHaveClass("swap-success__button");
  });
});
