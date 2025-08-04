import { api } from "./client";
import type {
  PriceFeedResponse,
  TransactionResponse,
  ApiResponse,
} from "@/types/recipient";
import { Invoice } from "@/types/invoice";
// import { PriceFeedData } from "@/lib/smartContract";

export const getPriceFeedFromBE = async (
  fromCurrency: string,
  toCurrency: string
): Promise<PriceFeedResponse> => {
  try {
    const response = await api.post<PriceFeedResponse>(
      `/getAllRatesToUsdc`,
      { fromCurrency, toCurrency } // ← kirim dalam body
    );
    console.log(response);
    if (response.data) {
      console.log(response.data);
      return response.data; // ← pastikan ini sesuai dengan struktur data yang diharapkan
    } else {
      throw new Error(response.data || "Failed to fetch price feed");
    }
  } catch (error) {
    console.error("Error fetching price feed from API:", error);
    throw error;
  }
};

export const getMultiplePriceFeeds = async (
  pairs: Array<{ from: string; to: string }>
): Promise<PriceFeedResponse[]> => {
  try {
    const response = await api.post<ApiResponse<PriceFeedResponse[]>>(
      "/price-feed/multiple",
      { pairs }
    );

    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch price feeds");
    }
  } catch (error) {
    console.error("Error fetching multiple price feeds:", error);
    throw error;
  }
};

export const initiateTransfer = async (
  recipientId: string,
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<TransactionResponse> => {
  try {
    const response = await api.post<ApiResponse<TransactionResponse>>(
      "/transactions/transfer",
      {
        recipientId,
        amount,
        fromCurrency,
        toCurrency,
      }
    );
    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error(
        response.data.message || "Failed to get transaction status"
      );
    }
  } catch (error) {
    console.error("Error getting transaction status:", error);
    throw error;
  }
};

// export const addInvoiceData = async (
//   payload: InvoiceCreationPayload
// ): Promise<any> => {
//   const response = await api.post("/addInvoiceData", payload);
//   console.log(payload)
//   return response.data;
// };

export const loadInvoiceData = async (payload: {
  txId: string;
}): Promise<ApiResponse<Invoice>> => {
  const response = await api.post("/loadInvoiceData", payload);
  console.log(payload);
  return response.data;
};
