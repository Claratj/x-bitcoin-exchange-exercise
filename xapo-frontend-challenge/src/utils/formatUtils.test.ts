import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatBtc,
  formatUsd,
  formatDecimal,
} from "./formatUtils";

describe("formatUtils", () => {
  describe("formatNumber", () => {
    it("formats numbers with specified decimals", () => {
      expect(formatNumber(123.456, 2)).toBe("123.46");
      expect(formatNumber(123.456, 0)).toBe("123");
      expect(formatNumber(123.456, 4)).toBe("123.4560");
    });

    it("returns null for negative numbers", () => {
      expect(formatNumber(-123.456, 2)).toBe(null);
    });

    it("handles zero and edge cases", () => {
      expect(formatNumber(0, 2)).toBe("0.00");
      expect(formatNumber(0.000001, 6)).toBe("0.000001");
      expect(formatNumber(999999.999, 2)).toBe("1000000.00");
    });
  });

  describe("formatBtc", () => {
    it("formats BTC amounts with 6 decimals", () => {
      expect(formatBtc(1.23456789)).toBe("1.234568");
      expect(formatBtc(0.000001)).toBe("0.000001");
    });

    it("returns null for negative BTC amounts", () => {
      expect(formatBtc(-1.23456789)).toBe(null);
    });

    it("handles large BTC amounts", () => {
      expect(formatBtc(1000000)).toBe("1000000.000000");
    });
  });

  describe("formatUsd", () => {
    it("formats USD amounts with 2 decimals", () => {
      expect(formatUsd(123.456)).toBe("123.46");
      expect(formatUsd(0.01)).toBe("0.01");
    });

    it("returns null for negative USD amounts", () => {
      expect(formatUsd(-123.456)).toBe(null);
    });

    it("handles large USD amounts", () => {
      expect(formatUsd(1000000)).toBe("1000000.00");
    });
  });

  describe("formatDecimal", () => {
    it("formats decimal numbers with specified precision", () => {
      expect(formatDecimal("123.456", 2)).toBe("123.45");
      expect(formatDecimal("123", 2)).toBe("123");
    });

    it("cleans and validates input", () => {
      expect(formatDecimal("abc123.45def", 2)).toBe("123.45");
      expect(formatDecimal("123,456", 2)).toBe("123.45");
    });

    it("handles special inputs", () => {
      expect(formatDecimal("", 2)).toBe("");
      expect(formatDecimal(".", 2)).toBe("0.");
      expect(formatDecimal(",", 2)).toBe("0.");
    });

    it("handles invalid inputs", () => {
      expect(formatDecimal("abc", 2)).toBe("0");
      expect(formatDecimal("123.45.67", 2)).toBe("123.45");
      expect(formatDecimal("123,45,67", 2)).toBe("123.45");
    });

    it("handles zero values", () => {
      expect(formatDecimal("0", 2)).toBe("0");
      expect(formatDecimal("0.000", 2)).toBe("0.00");
    });

    it("handles decimal point input while typing", () => {
      expect(formatDecimal("123.", 2)).toBe("123.");
      expect(formatDecimal("123,", 2)).toBe("123.");
    });

    it("removes leading zeros", () => {
      expect(formatDecimal("000123", 2)).toBe("123");
      expect(formatDecimal("000123.45", 2)).toBe("123.45");
    });

    it("handles multiple decimal points", () => {
      expect(formatDecimal("123.45.67", 2)).toBe("123.45");
      expect(formatDecimal("123.45.67.89", 2)).toBe("123.45");
    });
  });
});
