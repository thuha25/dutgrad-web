import { apiClient } from "@/lib/axios";
import { API_ROUTES } from "@/lib/constants";
import { AuthResponse } from "@/schemas/auth";
import { registerSchema } from "@/schemas/auth";
import { z } from "zod";
import { handleResponse } from "./helper";

type RegisterFormData = z.infer<typeof registerSchema>;

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthResponse {
  requires_mfa?: boolean;
  temp_token?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials
    );
    return handleResponse(response.data);
  },

  verifyMFA: async (
    code: string,
    useBackupCode: boolean = false,
    tempToken?: string
  ): Promise<AuthResponse> => {
    const config = tempToken
      ? {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      : undefined;

    const response = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.VERIFY_MFA,
      {
        code,
        use_backup_code: useBackupCode,
      },
      config
    );
    return handleResponse(response.data);
  },

  verifyExternalMFA: async (
    code: string,
    useBackupCode: boolean = false,
    tempToken?: string
  ): Promise<AuthResponse> => {
    const config = tempToken
      ? {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      : undefined;

    const response = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.MFA.VERIFY_EXTERNAL,
      {
        code,
        use_backup_code: useBackupCode,
      },
      config
    );
    return handleResponse(response.data);
  },

  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ROUTES.AUTH.REGISTER,
      data
    );
    return handleResponse(response.data);
  },

  logout: async (): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return handleResponse(response.data);
  },

  exchangeState: async (state: string): Promise<AuthResponse> => {
    const endpoint = `${
      API_ROUTES.AUTH.EXCHANGE_STATE
    }?state=${encodeURIComponent(state)}`;
    const response = await apiClient.post<AuthResponse>(endpoint);
    return handleResponse(response.data);
  },

  getGoogleAuthUrl: (): string => {
    const backendUrl =
      process.env.NEXT_PUBLIC_OAUTH_REDIRECT_HOST || "http://localhost/api";
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
    const callbackUrl = `${backendUrl}/${apiVersion}${API_ROUTES.AUTH.GOOGLE}`;
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow`;
    return googleLoginUrl;
  },
};
