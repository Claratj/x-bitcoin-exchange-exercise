export type Currency = "BTC" | "USD";

/**
 * Mode of the exchange - whether buying or selling the base currency
 */
export type ExchangeMode = "buy" | "sell";

/**
 * Props for the CurrencyInput component
 */
export interface CurrencyInputProps {
  /** Label text for the input */
  label: string;
  /** Current value of the input */
  value: string;
  /** Callback when the value changes */
  onChange: (value: string) => void;
  /** Type of currency (BTC or USD) */
  currency: Currency;
  /** Step value for decimal increments (e.g. "0.000001" for BTC, "0.01" for USD) */
  decimalStep?: string;
  /** Maximum number of decimal places */
  maxDecimals?: number;
  /** Additional CSS class name */
  className?: string;
  /** Error message to display */
  error?: string;
  /** Current balance for this currency */
  balance?: string;
  /** Callback when MAX button is clicked */
  onMaxClick?: () => void;
  /** Current exchange mode (buy or sell) */
  exchangeMode: ExchangeMode;
  /** Whether this input is for the base currency (BTC) */
  isBaseCurrency: boolean;
}
