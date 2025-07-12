import { ApiResponse, isSuccessResponse } from "@/schemas/api";

export const handleResponse = <T>(response: ApiResponse<T>): T => {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new Error(response.error || response.message || "Unknown error");
};
