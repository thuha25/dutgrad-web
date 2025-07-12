import { z } from "zod";
import Cookies from "js-cookie";
import { User } from "@/schemas/auth";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export function setAuthTokens({ accessToken }: { accessToken: string }): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("accessToken", accessToken);

    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
    Cookies.set("auth-token", accessToken, { path: "/", sameSite: "strict" });
  }
}

export function setAuthUser(user: User): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("authUser", JSON.stringify(user));

    Cookies.set("auth-user", JSON.stringify(user), {
      path: "/",
      sameSite: "strict",
    });
  }
}

export function clearAuthUser(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("authUser");

    Cookies.remove("auth-user");
  }
}

export function getAccessToken(): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("accessToken");
  }
  return null;
}

export function setAccessToken(token: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("accessToken", token);

    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
    Cookies.set("auth-token", token, { path: "/", sameSite: "strict" });
  }
}

export function clearAuthTokens(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("accessToken");

    Cookies.remove("has-session", { path: "/" });
    Cookies.remove("auth-token", { path: "/" });
  }
}

export function isAuthenticated(): boolean {
  const hasToken = !!getAccessToken();

  if (hasToken && typeof window !== "undefined" && window.localStorage) {
    Cookies.set("has-session", "true", { path: "/", sameSite: "strict" });
    Cookies.set("auth-token", getAccessToken() as string, {
      path: "/",
      sameSite: "strict",
    });
  }

  return hasToken;
}
