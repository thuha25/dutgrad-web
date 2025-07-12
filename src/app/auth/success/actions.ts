"use server";

import { stateParamSchema, AuthResponse } from "@/schemas/auth";
import { authService } from "@/services/api/auth.service";
import { cookies } from "next/headers";

type ExchangeStateResponse = {
  success: boolean;
  data?: AuthResponse;
  error?: string;
};

export async function exchangeStateAction(
  state: string
): Promise<ExchangeStateResponse> {
  const stateValidation = stateParamSchema.safeParse(state);
  if (!stateValidation.success) {
    console.error("Invalid state parameter:", stateValidation.error);
    return {
      success: false,
      error: "Invalid state parameter",
    };
  }

  try {
    const authData = await authService.exchangeState(stateValidation.data);

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
      success: true,
      data: authData,
    };
  } catch (error: any) {
    console.error("State exchange error:", error);

    return {
      success: false,
      error: error.message || "Failed to authenticate. Please try again.",
    };
  }
}
