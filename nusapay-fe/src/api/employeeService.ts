import { api } from "./client";
import type {
  Employee,
  editEmployeePayload,
  LoadPayloadForGroupId,
  ApiResponse,
} from "@/types/recipient";

export const loadEmployeeData = async (
  payload: LoadPayloadForGroupId
): Promise<Employee[]> => {
  try {
    const response = await api.post<ApiResponse<Employee[]>>(
      "/loadEmployeeDataFromGroup",
      payload
    );
    console.log(response);
    if (response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to load employee data");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to load employee data:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    throw error;
  }
};

export const addOrUpdateEmployeeData = async (
  payload: editEmployeePayload
): Promise<void> => {
  const response = await api.post("/addOrUpdateEmployeeData", payload);
  return response.data;
};

export const deleteEmployeeData = async (id: string): Promise<void> => {
  const response = await api.post("/deleteEmployeeDataFromGroup", { id });
  return response.data;
};
