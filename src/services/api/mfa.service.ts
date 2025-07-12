import { apiClient } from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "@/lib/constants";

export interface MFAStatusResponse {
  mfa_enabled: boolean;
}

export interface MFASetupResponse {
  secret: string;
  qr_code_data_url: string;
  backup_codes: string[];
  provisioning_uri?: string;
}

export interface MFAVerifyRequest {
  code: string;
}

export interface MFAVerifyLoginRequest {
  code: string;
  use_backup_code?: boolean;
}

export const mfaService = {
  getMFAStatus: async (): Promise<MFAStatusResponse> => {
    const response = await apiClient.get(API_ROUTES.AUTH.MFA.STATUS);
    return handleResponse(response.data);
  },

  setupMFA: async (): Promise<MFASetupResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.MFA.SETUP);
    return handleResponse(response.data);
  },

  verifyAndEnableMFA: async (code: string): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.AUTH.MFA.VERIFY, { code });
    return handleResponse(response.data);
  },

  disableMFA: async (): Promise<void> => {
    const response = await apiClient.post(API_ROUTES.AUTH.MFA.DISABLE);
    return handleResponse(response.data);
  },

  verifyMFA: async (
    code: string,
    useBackupCode: boolean = false
  ): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.VERIFY_MFA, {
      code,
      use_backup_code: useBackupCode,
    });
    return handleResponse(response.data);
  },
};
