import React from "react";
import "./SuccessView.css";

interface SuccessViewProps {
  btcValue: string;
  usdValue: string;
  exchangeMode: "buy" | "sell";
  onReset: () => void;
}

/**
 * SuccessView component that displays the success message and transaction details
 * after a successful exchange.
 */
export const SuccessView: React.FC<SuccessViewProps> = ({
  btcValue,
  usdValue,
  exchangeMode,
  onReset,
}) => {
  const getSuccessMessage = () => {
    if (exchangeMode === "buy") {
      return `You have successfully bought ${btcValue} BTC for ${usdValue} USD`;
    }
    return `You have successfully sold ${btcValue} BTC for ${usdValue} USD`;
  };

  const getTitle = () => {
    return exchangeMode === "buy" ? "Purchase Successful!" : "Sale Successful!";
  };

  return (
    <div className="swap-success-wrapper">
      <div
        className="swap-success"
        role="alert"
        aria-live="polite"
        aria-label="Transaction successful"
      >
        <h2>{getTitle()}</h2>
        <p>{getSuccessMessage()}</p>
        <button
          onClick={onReset}
          className="swap-success__button"
          aria-label="Make another transaction"
          autoFocus={true}
        >
          Make Another Swap
        </button>
      </div>
    </div>
  );
};
