import axios from "axios";

const API_URL = "https://api.coindesk.com/v1/bpi/currentprice.json";

export interface ExchangeRateResponse {
  bpi: {
    USD: {
      rate_float: number;
    };
  };
}

export const fetchExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get<ExchangeRateResponse>(API_URL);
    return response.data.bpi.USD.rate_float;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw new Error("Failed to fetch exchange rate");
  }
};
