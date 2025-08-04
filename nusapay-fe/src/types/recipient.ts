//data penerima

// Tipe asli dari data backend
export interface Employee {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  bankCode: string;
  bankAccount: string; //no rekening
  bankAccountName: string; //nama bank
  walletAddress: string;
  networkChainId: number;
  amountTransfer: number; // jumlah tf pengirim
  currency: string; //wallet si pengirim
  localCurrency: string; //wallet penerima
}

export interface AddEmployeePayload {
  companyId: string;
  companyName: string;
  name: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  walletAddress: string;
  networkChainId: number;
  amountTransfer: number;
  currency: string;
  localCurrency: string;
  groupId: string;
}

export interface editEmployeePayload {
  id: string;
  bankCode: string;
  bankAccount: string;
  bankAccountName: string;
  amountTransfer: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PriceFeedResponse {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

export interface TransactionResponse {
  id: string;
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
  timestamp: string;
}

export interface LoadPayloadWithCompanyId {
  companyId: string;
}

export interface LoadPayloadForGroupId {
  groupId: string;
}
