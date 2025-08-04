
import { Invoice, InvoiceCreationPayload } from "@/types/invoice"
import { ApiResponse } from "@/types/recipient"


export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Base API configuration - fix untuk localhost
const getApiBaseUrl = () => {
  // Untuk client-side, gunakan relative path
  if (typeof window !== "undefined") {
    return "/api"
  }
  // Untuk server-side, gunakan full URL
  return process.env.NEXT_PUBLIC_API_URL
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`🌐 API Request: ${config.method || "GET"} ${url}`) // Debug log

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`❌ API Error: ${response.status}`, errorData) // Debug log
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
      )
    }

    const data = await response.json()
    console.log(`✅ API Success:`, data) // Debug log
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network or parsing errors
    console.error(`🔥 Network Error:`, error) // Debug log

    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Unable to connect to server. Please check if the server is running.", 0)
    }

    throw new ApiError(error instanceof Error ? error.message : "Network error occurred", 0)
  }
}

export const invoiceApi = {
    getById: async(invoiceId:string): Promise<Invoice> =>{
        const response = await apiRequest<ApiResponse<Invoice>>(`/invoices/${invoiceId}`)
        if(!response.data){
            throw new ApiError("Invoice not found", 404)
        }
        return response.data
    },

    getAll: async() : Promise<Invoice[]> =>{
        const response = await apiRequest<ApiResponse<Invoice[]>> ("/invoices")
        return response.data || []
    },
    
    create: async (payload: InvoiceCreationPayload): Promise<Invoice> => {
    const response = await apiRequest<Invoice>("/invoices/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  },
}