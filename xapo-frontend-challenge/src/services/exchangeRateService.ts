import axios from "axios";

const API_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const DEFAULT_RATE = 50000; // Default rate in case of API failure

export interface ExchangeRateResponse {
  bitcoin: {
    usd: number;
  };
}

export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get<ExchangeRateResponse>(API_URL);
    return response.data.bitcoin.usd;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return DEFAULT_RATE; // Return default rate instead of throwing error
  }
};
