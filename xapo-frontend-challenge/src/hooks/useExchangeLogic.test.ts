import { renderHook, act, waitFor } from "@testing-library/react";
import { useExchangeLogic } from "./useExchangeLogic";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as exchangeRateService from "../services/exchangeRateService";
import * as formatUtils from "../utils/formatUtils";

// Mock the formatUtils
vi.mock("../utils/formatUtils", async () => {
  const actual = await vi.importActual<typeof formatUtils>(
    "../utils/formatUtils"
  );
  return {
    ...actual,
    formatBtc: vi.fn((value) => value?.toString() || "0"),
    formatUsd: vi.fn((value) => value?.toString() || "0"),
  };
});

// Mock fetch for exchange rate
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        bpi: {
          USD: {
            rate_float: 50000,
          },
        },
      }),
  } as Response)
);

vi.spyOn(exchangeRateService, "fetchExchangeRate").mockResolvedValue(50000);

describe("useExchangeLogic", () => {
  const mockProps = {
    balance: {
      btc: 1.5,
      usd: 50000,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with default values", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    await waitFor(() => {
      expect(result.current.exchangeRate).toBe(50000);
      expect(result.current.exchangeMode).toBe("buy");
      expect(result.current.btcValue).toBe("");
      expect(result.current.usdValue).toBe("");
      expect(result.current.error).toBeNull();
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("handles BTC input changes", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("1", "BTC");
    });

    await waitFor(() => {
      expect(result.current.btcValue).toBe("1");
      expect(result.current.usdValue).toBe("50000");
    });
  });

  it("handles USD input changes", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("50000", "USD");
    });

    await waitFor(() => {
      expect(result.current.usdValue).toBe("50000");
      expect(result.current.btcValue).toBe("1");
    });
  });

  it("validates minimum BTC amount from BTC input", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("0.0000001", "BTC");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Minimum BTC amount is 0.000001");
    });
  });

  it("validates maximum BTC amount from BTC input", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("101", "BTC");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Maximum BTC amount is 100");
    });
  });

  it("validates minimum BTC amount from USD input", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("0.01", "USD");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Minimum BTC amount is 0.000001");
    });
  });

  it("validates maximum BTC amount from USD input", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("6000000", "USD");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Maximum BTC amount is 100");
    });
  });

  it("validates balance limits in buy mode", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.handleAmountChange("60000", "USD");
    });

    await waitFor(() => {
      expect(result.current.usdValue).toBe("60000");
    });

    act(() => {
      result.current.handleBlur("USD");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Insufficient USD balance");
    });
  });

  it("validates balance limits in sell mode", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.switchExchangeMode();
    });

    await waitFor(() => {
      expect(result.current.exchangeMode).toBe("sell");
    });

    act(() => {
      result.current.handleAmountChange("2", "BTC");
    });

    await waitFor(() => {
      expect(result.current.btcValue).toBe("2");
    });

    act(() => {
      result.current.handleBlur("BTC");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Insufficient BTC balance");
    });
  });

  it("executes exchange successfully", async () => {
    const onBalanceChange = vi.fn();
    const { result } = renderHook(() =>
      useExchangeLogic({ ...mockProps, onBalanceChange })
    );

    act(() => {
      result.current.handleAmountChange("1", "BTC");
    });

    await waitFor(() => {
      expect(result.current.btcValue).toBe("1");
      expect(result.current.usdValue).toBe("50000");
    });

    act(() => {
      result.current.handleBlur("BTC");
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });

    act(() => {
      result.current.executeExchange();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(onBalanceChange).toHaveBeenCalledWith({
        btc: mockProps.balance.btc + 1,
        usd: mockProps.balance.usd - 50000,
      });
    });
  });

  it("resets fields after resetFields call", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.resetFields();
    });

    await waitFor(() => {
      expect(result.current.btcValue).toBe("");
      expect(result.current.usdValue).toBe("");
      expect(result.current.error).toBeNull();
    });
  });

  it("fetches and sets exchange rate on mount", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    await waitFor(() => {
      expect(result.current.exchangeRate).toBe(50000);
      expect(result.current.isLoadingRate).toBe(false);
    });
  });

  it("updates exchange rate periodically", async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(exchangeRateService, "fetchExchangeRate");
    const { unmount } = renderHook(() => useExchangeLogic(mockProps));

    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(spy).toHaveBeenCalledTimes(2);

    unmount();
  });

  it("can manually set isSuccess", async () => {
    const { result } = renderHook(() => useExchangeLogic(mockProps));

    act(() => {
      result.current.setIsSuccess(true);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
