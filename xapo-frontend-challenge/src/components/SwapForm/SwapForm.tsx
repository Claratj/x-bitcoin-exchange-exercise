import React, { useState } from "react";
import { CurrencyInput } from "../CurrencyInput/CurrencyInput";
import { SuccessView } from "../../views/SuccessView/SuccessView";
import { useExchangeLogic } from "../../hooks/useExchangeLogic";
import { Spinner } from "../shared/Spinner/Spinner";
import { SwapSeparator } from "../shared/SwapSeparator/SwapSeparator";
import { formatBtc, formatUsd } from "../../utils/formatUtils";
import "./SwapForm.css";
import { BuySellToggle } from "../BuySellToggle/BuySellToggle";
import { Divider } from "../shared/Divider/Divider";

interface SwapFormProps {
  /** Initial balance */
  balance: {
    btc: number;
    usd: number;
  };
}

/**
 * Form for buying or selling Bitcoin
 * Shows the current exchange rate and lets you enter amounts
 */
export function SwapForm({ balance: initialBalance }: SwapFormProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [isReversed, setIsReversed] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const {
    exchangeRate,
    isLoading,
    exchangeMode,
    btcValue,
    usdValue,
    error,
    isSuccess,
    switchExchangeMode,
    handleAmountChange,
    executeExchange,
    resetFields,
    setIsSuccess,
    isLoadingRate,
  } = useExchangeLogic({ balance, onBalanceChange: setBalance });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeExchange();
  };

  const handleMaxBtc = () => {
    if (exchangeMode === "sell") {
      const formattedBtc = formatBtc(balance.btc);
      if (formattedBtc) handleAmountChange(formattedBtc, "BTC");
    } else {
      const formattedBtc = formatBtc(balance.usd / exchangeRate);
      if (formattedBtc) handleAmountChange(formattedBtc, "BTC");
    }
  };

  const handleMaxUsd = () => {
    if (exchangeMode === "buy") {
      const formattedUsd = formatUsd(balance.usd);
      if (formattedUsd) handleAmountChange(formattedUsd, "USD");
    } else {
      const formattedUsd = formatUsd(balance.btc * exchangeRate);
      if (formattedUsd) handleAmountChange(formattedUsd, "USD");
    }
  };

  const handleSwapOrder = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setTimeout(() => {
      setIsReversed(!isReversed);
      setTimeout(() => {
        setIsSwapping(false);
      }, 150);
    }, 150);
  };

  const isFormValid = () => {
    if (!btcValue || !usdValue) return false;

    const btcAmount = parseFloat(btcValue);
    const usdAmount = parseFloat(usdValue);
    const btcBalance = parseFloat(formatBtc(balance.btc) || "0");
    const usdBalance = parseFloat(formatUsd(balance.usd) || "0");

    if (isNaN(btcAmount) || isNaN(usdAmount)) return false;

    if (exchangeMode === "buy") {
      // In buy mode, validate that the USD amount does not exceed the balance
      return usdAmount <= usdBalance;
    } else {
      // In sell mode, validate that the BTC amount does not exceed the balance
      return btcAmount <= btcBalance;
    }
  };

  if (isSuccess) {
    return (
      <SuccessView
        btcValue={btcValue}
        usdValue={usdValue}
        exchangeMode={exchangeMode}
        onReset={() => {
          setIsSuccess(false);
          resetFields();
        }}
      />
    );
  }

  // Show loading spinner while processing
  if (isLoading) {
    return (
      <div
        className="swap-form swap-form--loading"
        role="status"
        aria-label="Processing transaction"
      >
        <Spinner size="large" color="blue" />
        <p className="swap-form__loading-text">
          Processing your transaction...
        </p>
      </div>
    );
  }

  // Format balances based on exchange mode
  const formattedBtcBalance = formatBtc(balance.btc) || "0.000000";
  const formattedUsdBalance = formatUsd(balance.usd) || "0.00";

  // Always show real balances
  const getBtcBalance = () => formattedBtcBalance;
  const getUsdBalance = () => formattedUsdBalance;

  // Determine which balance to show in each input based on mode and order
  const getFirstInputBalance = () => {
    if (isReversed) {
      return getUsdBalance();
    }
    return getBtcBalance();
  };

  const getSecondInputBalance = () => {
    if (isReversed) {
      return getBtcBalance();
    }
    return getUsdBalance();
  };

  return (
    <form
      className="swap-form"
      role="form"
      aria-label="Bitcoin exchange form"
      onSubmit={handleSubmit}
    >
      <div className="swap-form__header">
        <h2>{exchangeMode === "buy" ? "Buy" : "Sell"} Bitcoin</h2>
        <div className="swap-form__mode-container">
          <BuySellToggle mode={exchangeMode} onToggle={switchExchangeMode} />
        </div>
      </div>

      <div className="swap-form__inputs">
        <CurrencyInput
          label={isReversed ? "USD Amount" : "BTC Amount"}
          value={isReversed ? usdValue : btcValue}
          onChange={(val) =>
            handleAmountChange(val, isReversed ? "USD" : "BTC")
          }
          currency={isReversed ? "USD" : "BTC"}
          decimalStep={isReversed ? "0.01" : "0.000001"}
          maxDecimals={isReversed ? 2 : 6}
          className={`swap-form__input first ${isSwapping ? "swapping" : ""}`}
          error={!isReversed && error ? error : undefined}
          balance={getFirstInputBalance()}
          onMaxClick={isReversed ? handleMaxUsd : handleMaxBtc}
          exchangeMode={exchangeMode}
          isBaseCurrency={!isReversed}
        />

        <SwapSeparator onClick={handleSwapOrder} />

        <CurrencyInput
          label={isReversed ? "BTC Amount" : "USD Amount"}
          value={isReversed ? btcValue : usdValue}
          onChange={(val) =>
            handleAmountChange(val, isReversed ? "BTC" : "USD")
          }
          currency={isReversed ? "BTC" : "USD"}
          decimalStep={isReversed ? "0.000001" : "0.01"}
          maxDecimals={isReversed ? 6 : 2}
          className={`swap-form__input second ${isSwapping ? "swapping" : ""}`}
          error={isReversed && error ? error : undefined}
          balance={getSecondInputBalance()}
          onMaxClick={isReversed ? handleMaxBtc : handleMaxUsd}
          exchangeMode={exchangeMode}
          isBaseCurrency={isReversed}
        />
      </div>

      <div className="swap-form__rate" aria-label="Current exchange rate">
        {isLoadingRate ? (
          <p>Loading exchange rate...</p>
        ) : (
          <p>Current Exchange Rate: 1 BTC = ${exchangeRate.toLocaleString()}</p>
        )}
        <Divider />
      </div>

      {error && (
        <div className="swap-form__error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !btcValue || !usdValue || !isFormValid()}
        className="swap-form__confirm"
        aria-label={`Confirm ${
          exchangeMode === "buy" ? "buy" : "sell"
        } transaction`}
      >
        {isLoading ? (
          <Spinner size="small" color="white" />
        ) : (
          `Confirm ${exchangeMode === "buy" ? "Buy" : "Sell"}`
        )}
      </button>
    </form>
  );
}
