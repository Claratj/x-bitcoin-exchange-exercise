import { useState, useEffect } from "react";
import { fetchExchangeRate } from "../services/exchangeRateService";

interface Balance {
  btc: number;
  usd: number;
}

interface UseExchangeRateAndBalanceReturn {
  balance: Balance;
  exchangeRate: number;
  error: string | null;
  isLoading: boolean;
}

export function useExchangeRateAndBalance(): UseExchangeRateAndBalanceReturn {
  const [balance, setBalance] = useState<Balance>({ btc: 10, usd: 1000 });
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateExchangeRate = async () => {
      try {
        setIsLoading(true);
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
        setError(null);
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setError("Failed to fetch exchange rate. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    updateExchangeRate();
    const interval = setInterval(updateExchangeRate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return {
    balance,
    exchangeRate,
    error,
    isLoading,
  };
}
