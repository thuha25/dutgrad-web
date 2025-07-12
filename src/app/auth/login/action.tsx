"use server";

import { cookies } from "next/headers";
import { loginSchema } from "@/schemas/auth";
import { authService } from "@/services/api/auth.service";

interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function loginUser(formData: FormData): Promise<
  ActionResponse<{
    accessToken: string;
    refreshToken?: string;
    user?: {
      id: string | number;
      email: string;
      username: string;
      created_at: Date;
    };
    mfaRequired?: boolean;
    tempToken?: string;
  }>
> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        error:
          validatedFields.error.errors[0].message ||
          "Invalid email or password",
      };
    }

    const authData = await authService.login({
      email: validatedFields.data.email,
      password: password,
    });

    if (!authData) {
      return { error: "Invalid email or password" };
    }

    if (authData.requires_mfa) {
      return {
        data: {
          accessToken: "",
          mfaRequired: true,
          tempToken: authData.temp_token,
        },
      };
    }

    if (authData.refresh) {
      (await cookies()).set("refreshToken", authData.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      data: {
        accessToken: authData.token,
        refreshToken: authData.refresh,
        user: authData.user!,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response?.status === 401) {
      return { error: "Incorrect email or password. Please try again!" };
    }
    return {
      error: error.message || "Failed to authenticate. Please try again.",
    };
  }
}

export async function verifyMFA(formData: FormData): Promise<
  ActionResponse<{
    accessToken: string;
    refreshToken?: string;
    user: {
      id: string | number;
      email: string;
      username: string;
      created_at: Date;
    };
  }>
> {
  try {
    const code = formData.get("code") as string;
    const tempToken = formData.get("tempToken") as string;
    const useBackupCode = formData.get("useBackupCode") === "true";

    const authData = await authService.verifyExternalMFA(
      code,
      useBackupCode,
      tempToken
    );

    if (authData.refresh) {
      (await cookies()).set("refreshToken", authData.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return {
      data: {
        accessToken: authData.token,
        refreshToken: authData.refresh,
        user: authData.user!,
      },
    };
  } catch (error: any) {
    console.error("MFA verification error:", error);
    if (error.response?.status === 401) {
      return { error: "Invalid verification code. Please try again!" };
    }
    return {
      error: error.message || "Failed to verify MFA. Please try again.",
    };
  }
}
