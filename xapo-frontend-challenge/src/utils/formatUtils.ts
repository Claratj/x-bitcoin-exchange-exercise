const BTC_DECIMALS = 6;
const USD_DECIMALS = 2;

/**
 * Format a number to a fixed number of decimal places
 */
export const formatNumber = (num: number, decimals: number): string | null => {
  if (num < 0) return null;
  return num.toFixed(decimals);
};

/**
 * Format BTC with the right number of decimals
 */
export const formatBtc = (amount: number): string | null => {
  if (amount < 0) return null;
  return formatNumber(amount, BTC_DECIMALS);
};

/**
 * Format USD with 2 decimals
 */
export const formatUsd = (amount: number): string | null => {
  if (amount < 0) return null;
  return formatNumber(amount, USD_DECIMALS);
};

/**
 * Format and validate decimal input:
 * - Input cleaning removing invalid characters
 * - Decimal separator standardization (converts commas to dots)
 * - Decimal places limitation with rounding
 * - Special cases (empty input, just decimal separator)
 */
export const formatDecimal = (
  value: string,
  maxDecimals: number
): string | null => {
  // Allow empty input
  if (value === "") return "";

  // Allow only the decimal point or comma
  if (value === "." || value === ",") return "0.";

  // Clean invalid characters and standardize to decimal point
  let cleaned = value.replace(/[^\d.,]/g, "").replace(/,/g, ".");

  // Handle multiple decimal points
  const decimalPoints = cleaned.match(/\./g)?.length || 0;
  if (decimalPoints > 1) {
    // Keep only the first decimal point
    const parts = cleaned.split(".");
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // If it ends with a decimal point, keep it to allow writing more
  if (cleaned.endsWith(".")) {
    return cleaned;
  }

  // If it's only zeros or is empty after cleaning
  if (!cleaned || /^0+$/.test(cleaned)) {
    return "0";
  }

  // If it doesn't have a decimal point
  if (!cleaned.includes(".")) {
    // Remove leading zeros
    cleaned = cleaned.replace(/^0+(\d)/, "$1");
    return cleaned || "0";
  }

  // Separate integer and decimal parts
  let [integerPart, decimalPart = ""] = cleaned.split(".");

  // Remove leading zeros in the integer part
  integerPart = integerPart.replace(/^0+(\d)/, "$1") || "0";

  // If the decimal part is longer than the maximum allowed
  if (decimalPart.length > maxDecimals) {
    decimalPart = decimalPart.slice(0, maxDecimals);
  }

  // Rebuild the number
  return `${integerPart}${decimalPart ? "." + decimalPart : ""}`;
};
