import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

// Mock fetch
global.fetch = vi.fn();

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
    expect(screen.getByText("You buy")).toBeInTheDocument();
    expect(screen.getByText("You spend")).toBeInTheDocument();
  });

  it("handles mode switch", () => {
    render(<SwapForm balance={mockBalance} />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    expect(mockExchangeLogic.switchExchangeMode).toHaveBeenCalled();
  });

  it("handles BTC input changes", () => {
    render(<SwapForm balance={mockBalance} />);
    const btcInput = screen.getByRole("textbox", { name: "BTC amount buy" });
    fireEvent.change(btcInput, { target: { value: "0.2" } });
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "0.2",
      "BTC"
    );
  });

  it("handles USD input changes", () => {
    render(<SwapForm balance={mockBalance} />);
    const usdInput = screen.getByRole("textbox", { name: "USD amount buy" });
    fireEvent.change(usdInput, { target: { value: "10000" } });
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "10000",
      "USD"
    );
  });

  it("shows correct labels in sell mode", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      exchangeMode: "sell",
    });
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText("Sell Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("You sell")).toBeInTheDocument();
    expect(screen.getByText("You receive")).toBeInTheDocument();
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
    const errorMessages = screen.getAllByText(errorMessage);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(
      errorMessages.some(
        (e) =>
          e.className.includes("swap-form__error") ||
          e.className.includes("currency-input__error")
      )
    ).toBe(true);
  });

  it("shows success view when transaction is successful", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      isSuccess: true,
    });
    render(<SwapForm balance={mockBalance} />);
    expect(screen.getByText("Swap Successful!")).toBeInTheDocument();
  });

  it("displays exchange rate", () => {
    render(<SwapForm balance={mockBalance} />);
    const rateContainer = screen.getByLabelText("Current exchange rate");
    expect(rateContainer).toHaveTextContent(
      "Current Exchange Rate: 1 BTC = $50,000"
    );
  });

  it("shows loading state for exchange rate", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      isLoadingRate: true,
    });
    render(<SwapForm balance={mockBalance} />);
    const rateContainer = screen.getByLabelText("Current exchange rate");
    expect(rateContainer).toHaveTextContent("Loading exchange rate...");
  });

  it("handles form submission", () => {
    render(<SwapForm balance={mockBalance} />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(mockExchangeLogic.executeExchange).toHaveBeenCalled();
  });

  it("handles max BTC button in buy mode", () => {
    render(<SwapForm balance={mockBalance} />);
    const maxButton = screen.getByLabelText("Set maximum BTC amount");
    fireEvent.click(maxButton);
    expect(formatBtc).toHaveBeenCalledWith(
      mockBalance.usd / mockExchangeLogic.exchangeRate
    );
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "1.500000",
      "BTC"
    );
  });

  it("handles max BTC button in sell mode", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      exchangeMode: "sell",
    });
    render(<SwapForm balance={mockBalance} />);
    const maxButton = screen.getByLabelText("Set maximum BTC amount");
    fireEvent.click(maxButton);
    expect(formatBtc).toHaveBeenCalledWith(mockBalance.btc);
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "1.500000",
      "BTC"
    );
  });

  it("handles max USD button in buy mode", () => {
    render(<SwapForm balance={mockBalance} />);
    const maxButton = screen.getByLabelText("Set maximum USD amount");
    fireEvent.click(maxButton);
    expect(formatUsd).toHaveBeenCalledWith(mockBalance.usd);
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "50000.00",
      "USD"
    );
  });

  it("handles max USD button in sell mode", () => {
    (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockExchangeLogic,
      exchangeMode: "sell",
    });
    render(<SwapForm balance={mockBalance} />);
    const maxButton = screen.getByLabelText("Set maximum USD amount");
    fireEvent.click(maxButton);
    expect(formatUsd).toHaveBeenCalledWith(
      mockBalance.btc * mockExchangeLogic.exchangeRate
    );
    expect(mockExchangeLogic.handleAmountChange).toHaveBeenCalledWith(
      "50000.00",
      "USD"
    );
  });

  describe("Balance updates", () => {
    it("updates balance after successful buy transaction", async () => {
      const onBalanceChange = vi.fn();
      (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        {
          ...mockExchangeLogic,
          btcValue: "0.1",
          usdValue: "5000",
          executeExchange: () => {
            onBalanceChange({
              btc: mockBalance.btc + 0.1,
              usd: mockBalance.usd - 5000,
            });
          },
        }
      );

      render(<SwapForm balance={mockBalance} />);
      const form = screen.getByRole("form");

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(onBalanceChange).toHaveBeenCalledWith({
        btc: mockBalance.btc + 0.1,
        usd: mockBalance.usd - 5000,
      });
    });

    it("updates balance after successful sell transaction", async () => {
      const onBalanceChange = vi.fn();
      (useExchangeLogic as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
        {
          ...mockExchangeLogic,
          exchangeMode: "sell",
          btcValue: "0.1",
          usdValue: "5000",
          executeExchange: () => {
            onBalanceChange({
              btc: mockBalance.btc - 0.1,
              usd: mockBalance.usd + 5000,
            });
          },
        }
      );

      render(<SwapForm balance={mockBalance} />);
      const form = screen.getByRole("form");

      await act(async () => {
        fireEvent.submit(form);
      });

      expect(onBalanceChange).toHaveBeenCalledWith({
        btc: mockBalance.btc - 0.1,
        usd: mockBalance.usd + 5000,
      });
    });
  });
});
