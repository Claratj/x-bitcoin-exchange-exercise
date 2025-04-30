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
 * - Decimal places limitation
 * - Special cases (empty input, just decimal separator)
 */
export const formatDecimal = (
  value: string,
  maxDecimals: number
): string | null => {
  if (value === "") return "";
  if (value === "." || value === ",") return "0.";

  // Clean input and standardize format
  const cleaned = value.replace(/[^\d.,]/g, "");
  const hasMultipleSeparators = (cleaned.match(/[.,]/g) || []).length > 1;
  if (hasMultipleSeparators) return null;
  const standardized = cleaned.replace(/,/g, ".");

  if (standardized.endsWith(".")) {
    return standardized;
  }

  if (!standardized.includes(".")) {
    if (standardized === "") return null;
    if (standardized === "0") return "0.00";
    return standardized;
  }

  const [integerPart, decimalPart] = standardized.split(".");

  if (isNaN(Number(integerPart))) return null;
  if (Number(integerPart) < 0) return null;

  // Convert to number and round to maxDecimals
  const num = parseFloat(`${integerPart}.${decimalPart}`);
  if (isNaN(num)) return null;

  // If we're just showing the integer part
  if (maxDecimals === 0) return integerPart;

  // Format with proper rounding
  return num.toFixed(maxDecimals);
};
