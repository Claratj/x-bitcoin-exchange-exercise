import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { CurrencyInput } from "./CurrencyInput";
import { describe, it, expect, vi } from "vitest";

describe("CurrencyInput", () => {
  const defaultProps = {
    value: "100",
    onChange: vi.fn(),
    currency: "BTC" as const,
    exchangeMode: "buy" as const,
    isBaseCurrency: true,
    balance: "1000",
    label: "BTC Amount",
  };

  it("renders with default props", () => {
    render(<CurrencyInput {...defaultProps} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("shows correct label for BTC in buy mode", () => {
    render(<CurrencyInput {...defaultProps} />);
    expect(screen.getByText("You buy")).toBeInTheDocument();
  });

  it("shows correct label for USD in buy mode", () => {
    render(
      <CurrencyInput
        {...defaultProps}
        currency="USD"
        isBaseCurrency={false}
        label="USD Amount"
      />
    );
    expect(screen.getByText("You spend")).toBeInTheDocument();
  });

  it("shows correct label for BTC in sell mode", () => {
    render(<CurrencyInput {...defaultProps} exchangeMode="sell" />);
    expect(screen.getByText("You sell")).toBeInTheDocument();
  });

  it("shows correct label for USD in sell mode", () => {
    render(
      <CurrencyInput
        {...defaultProps}
        currency="USD"
        exchangeMode="sell"
        isBaseCurrency={false}
        label="USD Amount"
      />
    );
    expect(screen.getByText("You receive")).toBeInTheDocument();
  });

  it("handles input changes correctly", () => {
    const onChange = vi.fn();
    render(<CurrencyInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "200" } });

    expect(onChange).toHaveBeenCalledWith("200");
  });

  it("displays balance when provided", () => {
    render(<CurrencyInput {...defaultProps} />);
    expect(screen.getByText("Balance:")).toBeInTheDocument();
    expect(screen.getByText("1000 BTC")).toBeInTheDocument();
  });

  it("displays error message when provided", () => {
    const errorMessage = "Insufficient funds";
    render(<CurrencyInput {...defaultProps} error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("calls onMaxClick when MAX button is clicked", () => {
    const onMaxClick = vi.fn();
    render(<CurrencyInput {...defaultProps} onMaxClick={onMaxClick} />);

    const maxButton = screen.getByText("MAX");
    fireEvent.click(maxButton);

    expect(onMaxClick).toHaveBeenCalled();
  });

  it("applies correct CSS classes based on exchange mode", () => {
    const { container } = render(<CurrencyInput {...defaultProps} />);
    expect(container.firstChild).toHaveClass("currency-input--buy");
  });

  it("allows clearing the input", () => {
    const onChange = vi.fn();
    render(
      <CurrencyInput {...defaultProps} onChange={onChange} value="1.23" />
    );
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("applies custom className", () => {
    const { container } = render(
      <CurrencyInput {...defaultProps} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("currency-input custom-class");
  });

  it("shows correct currency symbol and name", () => {
    render(<CurrencyInput {...defaultProps} />);
    expect(screen.getByText("₿")).toBeInTheDocument();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();

    render(
      <CurrencyInput {...defaultProps} currency="USD" label="USD Amount" />
    );
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("handles max decimals correctly", () => {
    const onChange = vi.fn();
    render(
      <CurrencyInput
        {...defaultProps}
        onChange={onChange}
        maxDecimals={2}
        currency="USD"
        label="USD Amount"
      />
    );
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "1.234" } });
    expect(onChange).toHaveBeenCalledWith("1.23");
  });

  it("shows placeholder when value is empty", () => {
    render(<CurrencyInput {...defaultProps} value="" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "0.00");
  });

  it("shows error for insufficient balance", () => {
    render(<CurrencyInput {...defaultProps} value="2000" />);
    expect(screen.getByText("Insufficient balance")).toBeInTheDocument();
  });
});
