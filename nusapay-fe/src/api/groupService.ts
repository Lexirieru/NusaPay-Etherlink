import { api } from "./client";
import type { Template } from "@/lib/template";
import type { LoadPayloadWithCompanyId, ApiResponse } from "@/types/recipient";

export const loadGroupName = async (
  payload: LoadPayloadWithCompanyId
): Promise<Template[]> => {
  try {
    const response = await api.post<ApiResponse<Template[]>>(
      "/loadGroupName",
      payload
    );
    console.log(response.data.data);
    if (response.data.data) {
      return response.data.data;
    } else {
      // Jika tidak, lemparkan error dengan pesan dari server
      throw new Error(response.data.message || "Failed to load employee data");
    }
  } catch (error: unknown) {
    // ✅ SOLUSI 3: Ganti 'any' dengan 'unknown'
    // Lakukan pemeriksaan tipe sebelum mengakses properti
    if (error instanceof Error) {
      console.error("Failed to load group name:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    throw error;
  }
};

export const addGroupName = async (payload: Template): Promise<void> => {
  const response = await api.post("/addGroupName", payload);
  console.log(payload);
  return response.data;
};
