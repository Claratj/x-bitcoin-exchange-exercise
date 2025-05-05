import { useState, useCallback, useEffect } from "react";
import { formatBtc, formatUsd, formatDecimal } from "../utils/formatUtils";
import { fetchExchangeRate } from "../services/exchangeRateService";

type ExchangeMode = "buy" | "sell";
export type Currency = "BTC" | "USD";

interface UseExchangeLogicProps {
  balance: {
    btc: number;
    usd: number;
  };
  onBalanceChange?: (newBalance: { btc: number; usd: number }) => void;
}

const MIN_BTC = 0.000001;
const MAX_BTC = 100;

const convertBtcToUsd = (btc: number, rate: number) => formatUsd(btc * rate);
const convertUsdToBtc = (usd: number, rate: number) => formatBtc(usd / rate);

export const useExchangeLogic = ({
  balance,
  onBalanceChange,
}: UseExchangeLogicProps) => {
  const [exchangeMode, setExchangeMode] = useState<ExchangeMode>("buy");
  const [btcValue, setBtcValue] = useState("");
  const [usdValue, setUsdValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(50000);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  useEffect(() => {
    const updateExchangeRate = async () => {
      try {
        setIsLoadingRate(true);
        const rate = await fetchExchangeRate();
        setExchangeRate(rate);
        setError(null);
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
      } finally {
        setIsLoadingRate(false);
      }
    };

    updateExchangeRate();
    const interval = setInterval(updateExchangeRate, 60000);
    return () => clearInterval(interval);
  }, []);

  const switchExchangeMode = useCallback(() => {
    setExchangeMode((prev) => (prev === "buy" ? "sell" : "buy"));
    setBtcValue("");
    setUsdValue("");
    setError(null);
  }, []);

  const handleAmountChange = useCallback(
    (value: string, currency: Currency) => {
      setError(null);

      if (currency === "BTC") {
        setBtcValue(value);
        if (!value) {
          setUsdValue("");
          return;
        }

        const formatted = formatDecimal(value, 6);
        if (formatted === null) return;

        const btc = parseFloat(formatted);
        if (btc < MIN_BTC) {
          setError("Minimum BTC amount is 0.000001");
          return;
        }
        if (btc > MAX_BTC) {
          setError("Maximum BTC amount is 100");
          return;
        }

        const usd = convertBtcToUsd(btc, exchangeRate);
        setUsdValue(usd ?? "");
      } else {
        setUsdValue(value);
        if (!value) {
          setBtcValue("");
          return;
        }

        const formatted = formatDecimal(value, 2);
        if (formatted === null) return;

        const usd = parseFloat(formatted);
        const btc = usd / exchangeRate;
        if (btc < MIN_BTC) {
          setError("Minimum BTC amount is 0.000001");
          return;
        }
        if (btc > MAX_BTC) {
          setError("Maximum BTC amount is 100");
          return;
        }

        const formattedBtc = convertUsdToBtc(usd, exchangeRate);
        setBtcValue(formattedBtc ?? "");
      }
    },
    [exchangeRate]
  );

  const executeExchange = useCallback(() => {
    const btc = parseFloat(btcValue);
    const usd = parseFloat(usdValue);

    if (isNaN(btc) || isNaN(usd)) {
      setError("Please enter valid amounts");
      return;
    }

    if (exchangeMode === "buy" && usd > balance.usd) {
      setError("Insufficient USD balance");
      return;
    }

    if (exchangeMode === "sell" && btc > balance.btc) {
      setError("Insufficient BTC balance");
      return;
    }

    setIsLoading(true);

    const newBalance = {
      btc: exchangeMode === "buy" ? balance.btc + btc : balance.btc - btc,
      usd: exchangeMode === "buy" ? balance.usd - usd : balance.usd + usd,
    };

    if (onBalanceChange) {
      onBalanceChange(newBalance);
    }

    setIsLoading(false);
    setIsSuccess(true);
  }, [btcValue, usdValue, exchangeMode, balance, onBalanceChange]);

  const resetFields = useCallback(() => {
    setBtcValue("");
    setUsdValue("");
    setError(null);
  }, []);

  return {
    exchangeMode,
    btcValue,
    usdValue,
    error,
    isLoading,
    isSuccess,
    exchangeRate,
    isLoadingRate,
    switchExchangeMode,
    handleAmountChange,
    executeExchange,
    resetFields,
    setIsSuccess,
  };
};
