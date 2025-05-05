import React from "react";
import { formatDecimal } from "../../utils/formatUtils";
import { CurrencyInputProps } from "./types";
import "./CurrencyInput.css";
import { Divider } from "../shared/Divider/Divider";

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency,
  maxDecimals = currency === "BTC" ? 6 : 2,
  className = "",
  error,
  balance,
  onMaxClick,
  exchangeMode,
  isBaseCurrency,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Allow to erase all content
    if (newValue === "") {
      onChange("");
      return;
    }

    // Validate only numbers, dots and commas
    if (!/^[\d.,]*$/.test(newValue)) {
      return;
    }

    const formattedValue = formatDecimal(newValue, maxDecimals);
    if (formattedValue !== null) {
      onChange(formattedValue);
    }
  };

  const getCurrencySymbol = () => {
    return currency === "BTC" ? "₿" : "$";
  };

  const getCurrencyName = () => {
    return currency === "BTC" ? "Bitcoin" : "USD";
  };

  const getActionLabel = () => {
    if (exchangeMode === "buy") {
      if (isBaseCurrency) return "You buy";
      return "You spend";
    } else {
      if (isBaseCurrency) return "You sell";
      return "You receive";
    }
  };

  const getError = () => {
    if (error) return error;
    if (balance && value && parseFloat(value) > parseFloat(balance)) {
      return "Insufficient balance";
    }
    return undefined;
  };

  return (
    <div
      className={`currency-input ${className} currency-input--${exchangeMode}`}
    >
      <div className="currency-input__header">
        <label className="currency-input__label" htmlFor={`${currency}-input`}>
          {getActionLabel()}
        </label>
      </div>
      <div className="currency-input__container">
        <div className="currency-input__left">
          <span className="currency-input__symbol">
            {getCurrencySymbol()}
            <span className="currency-input__symbol-text">
              {getCurrencyName()}
            </span>
          </span>
        </div>
        <input
          id={`${currency}-input`}
          type="text"
          value={value}
          onChange={handleChange}
          inputMode="decimal"
          className="currency-input__input"
          placeholder="0.00"
          aria-label={`${currency} amount ${exchangeMode}`}
        />
      </div>
      <Divider />
      {balance !== undefined && (
        <div className="currency-input__balance">
          Balance:
          <div className="currency-input__balance-right">
            <span className="currency-input__balance-amount">
              {balance} {currency}
            </span>
            {onMaxClick && (
              <button
                type="button"
                className="currency-input__max"
                onClick={() => {
                  onChange(balance);
                  onMaxClick();
                }}
                aria-label={`Set maximum ${currency} amount`}
              >
                MAX
              </button>
            )}
          </div>
        </div>
      )}
      {getError() && (
        <div className="currency-input__error" role="alert">
          {getError()}
        </div>
      )}
    </div>
  );
};
