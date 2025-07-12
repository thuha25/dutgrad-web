"use server";

import { cookies } from "next/headers";
import { authService } from "@/services/api/auth.service";

interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export async function logoutUser(): Promise<ActionResponse<null>> {
  try {
    (await cookies()).delete("refreshToken");

    try {
      await authService.logout();
    } catch (error) {
      console.log(
        "Error calling logout endpoint, continuing logout process:",
        error
      );
    }

    return { data: null };
  } catch (error: any) {
    return { error: "Failed to logout. Please try again." };
  }
}
