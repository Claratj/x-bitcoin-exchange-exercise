import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { fetchExchangeRate } from "./exchangeRateService";

vi.mock("axios");

describe("exchangeRateService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch exchange rate successfully", async () => {
    const mockRate = 50000;
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        bitcoin: {
          usd: mockRate,
        },
      },
    });

    const rate = await fetchExchangeRate();
    expect(rate).toBe(mockRate);
  });

  it("should return default rate when API fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    const rate = await fetchExchangeRate();
    expect(rate).toBe(50000); // Default rate
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should call the correct API endpoint", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        bitcoin: {
          usd: 50000,
        },
      },
    });

    await fetchExchangeRate();
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );
  });
});
