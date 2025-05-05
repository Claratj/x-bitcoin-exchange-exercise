import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SwapForm } from "./SwapForm";
import { useExchangeLogic } from "../../hooks/useExchangeLogic";
import { formatBtc, formatUsd } from "../../utils/formatUtils";
import "@testing-library/jest-dom/vitest";

// Mock useExchangeLogic hook
vi.mock("../../hooks/useExchangeLogic", () => ({
  useExchangeLogic: vi.fn(),
}));

// Mock formatUtils
vi.mock("../../utils/formatUtils", () => ({
  formatBtc: vi.fn(),
  formatUsd: vi.fn(),
  formatDecimal: vi.fn((value) => value),
}));

describe("SwapForm", () => {
  const mockBalance = {
    btc: 1.5,
    usd: 1000,
  };

  const mockExchangeLogic = {
    exchangeRate: 50000,
    isLoading: false,
    exchangeMode: "buy" as const,
    btcValue: "0.1",
    usdValue: "5000",
    error: null,
    isSuccess: false,
    switchExchangeMode: vi.fn(),
    handleAmountChange: vi.fn(),
    executeExchange: vi.fn(),
    resetFields: vi.fn(),
    setIsSuccess: vi.fn(),
    isLoadingRate: false,
  };

  beforeEach(() => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockExchangeLogic
    );
    (formatBtc as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      "1.500000"
    );
    (formatUsd as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      "50000.00"
    );
    vi.clearAllMocks();
  });

  it("renders in buy mode by default", () => {
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText("Buy Bitcoin")).toBeInTheDocument();
  });

  it("handles mode switch", () => {
    render(<SwapForm balance={mockBalance} />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    expect(mockExchangeLogic.switchExchangeMode).toHaveBeenCalled();
  });

  it.each([
    ["BTC", "0.2"],
    ["USD", "10000"],
  ])("handles %s input changes", (currency, value) => {
    render(<SwapForm balance={mockBalance} />);
    const input = screen.getByRole("textbox", {
      name: `${currency} amount ${mockExchangeLogic.exchangeMode}`,
    });
    fireEvent.change(input, { target: { value } });
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      value,
      currency
    );
  });

  it("shows correct labels in sell mode", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      exchangeMode: "sell",
    });
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText("Sell Bitcoin")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      isLoading: true,
    });
    render(<SwapForm balance={mockBalance} />);
    expect(
      screen.getByText("Processing your transaction...")
    ).toBeInTheDocument();
  });

  it("displays error message", () => {
    const errorMessage = "Test error message";
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      error: errorMessage,
    });
    render(<SwapForm balance={mockBalance} />);
    const errorElements = screen.getAllByText(errorMessage);
    expect(errorElements.length).toBeGreaterThan(0);
    expect(errorElements[0]).toHaveAttribute("role", "alert");
  });

  it.each([
    ["buy", "Purchase Successful!", "bought"],
    ["sell", "Sale Successful!", "sold"],
  ])("shows success view in %s mode", (mode, title, action) => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      isSuccess: true,
      exchangeMode: mode,
    });
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`You have successfully ${action} 0.1 BTC for 5000 USD`)
      )
    ).toBeInTheDocument();
  });

  it("displays exchange rate", () => {
    render(<SwapForm balance={mockBalance} />);
    expect(
      screen.getByText("Current Exchange Rate: 1 BTC = $50,000")
    ).toBeInTheDocument();
  });

  it("shows loading state for exchange rate", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      isLoadingRate: true,
    });
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText("Loading exchange rate...")).toBeInTheDocument();
  });

  it("handles form submission", () => {
    render(<SwapForm balance={mockBalance} />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockExchangeLogic.executeExchange).toHaveBeenCalled();
  });

  it.each([
    ["BTC", "0.02", mockBalance.usd / mockExchangeLogic.exchangeRate],
    ["USD", "1000.00", mockBalance.usd],
  ])(
    "handles max %s button in buy mode",
    (currency, expectedValue, expectedFormatInput) => {
      const formatFn = currency === "BTC" ? formatBtc : formatUsd;
      (formatFn as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        expectedValue
      );
      render(<SwapForm balance={mockBalance} />);
      const maxButton = screen.getByLabelText(`Set maximum ${currency} amount`);
      fireEvent.click(maxButton);
      expect(formatFn).toHaveBeenCalledWith(expectedFormatInput);
      expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
        expectedValue,
        currency
      );
    }
  );

  it("handles swap order", () => {
    render(<SwapForm balance={mockBalance} />);
    const swapButton = screen.getByRole("button", {
      name: /swap input order/i,
    });
    fireEvent.click(swapButton);
    // Add assertions for swap behavior
  });

  it("disables submit button when form is invalid", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      btcValue: "",
      usdValue: "",
    });
    render(<SwapForm balance={mockBalance} />);
    const submitButton = screen.getByRole("button", { name: /confirm buy/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when form is valid", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      btcValue: "0.1",
      usdValue: "5000",
    });
    render(<SwapForm balance={mockBalance} />);
    const submitButton = screen.getByRole("button", { name: /confirm buy/i });
    expect(submitButton).not.toBeDisabled();
  });
});
