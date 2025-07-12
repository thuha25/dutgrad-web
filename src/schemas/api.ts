export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

export type ApiSuccessResponse<T> = ApiResponse<T> & {
  data: T; 
  error: undefined;
};

export type ApiErrorResponse = ApiResponse & {
  data: undefined;
  error: string;  
};

export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.status >= 200 && response.status < 300 && response.data !== undefined;
}

export function isErrorResponse(response: ApiResponse): response is ApiErrorResponse {
  return response.status >= 400 || response.error !== undefined;
}
