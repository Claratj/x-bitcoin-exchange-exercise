import React from "react";
import { SwapForm } from "../../components/SwapForm/SwapForm";
import { useExchangeRateAndBalance } from "../../hooks/useExchangeRateAndBalance";
import { Spinner } from "../../components/shared/Spinner/Spinner";
import "./ExchangePage.css";

export function ExchangePage() {
  const { balance, error, isLoading } = useExchangeRateAndBalance();

  if (isLoading) {
    return (
      <div className="exchange-page exchange-page--loading">
        <Spinner size="large" color="blue" />
        <p className="exchange-page__loading-text">Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div className="exchange-page">
      <SwapForm balance={balance} />
    </div>
  );
}
