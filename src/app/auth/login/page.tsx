"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_ROUTES } from "@/lib/constants";
import { useAuth } from "@/context/auth.context";
import OAuthButtons from "@/components/auth/oauth-buttons";
import MfaVerifyForm from "@/components/auth/mfa-verify-form";
import { loginUser } from "./action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { loginSuccess } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showMfaForm, setShowMfaForm] = useState<boolean>(false);
  const [tempToken, setTempToken] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await loginUser(formData);

      console.log("Login result:", result);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.data?.mfaRequired && result.data.tempToken) {
        setTempToken(result.data.tempToken);
        setShowMfaForm(true);
        setIsLoading(false);
        return;
      }

      if (result.data?.accessToken && result.data.user) {
        setIsSuccess(true);
        loginSuccess(result.data.accessToken, result.data.user);

        setTimeout(() => {
          router.push(APP_ROUTES.DASHBOARD);
        }, 500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleMfaSuccess(accessToken: string, user: any) {
    setIsSuccess(true);
    loginSuccess(accessToken, user);

    setTimeout(() => {
      router.push(APP_ROUTES.DASHBOARD);
    }, 500);
  }

  function handleMfaError(errorMessage: string) {
    setError(errorMessage);
  }

  function handleBackToLogin() {
    setShowMfaForm(false);
    setError(null);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Login Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 py-8">
            <div className="text-xl font-medium text-center">
              Redirecting to dashboard...
            </div>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showMfaForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="mb-4">
              <h1 className="text-2xl font-bold">DUT Grad</h1>
            </div>
            <CardTitle className="text-2xl font-bold">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Enter the verification code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <MfaVerifyForm
              tempToken={tempToken}
              onSuccess={handleMfaSuccess}
              onError={handleMfaError}
              onBack={handleBackToLogin}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold">DUT Grad</h1>
          </div>
          <CardTitle className="text-2xl font-bold">
            Sign in to your account
          </CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in with Email"}
            </Button>
          </form>

          <OAuthButtons />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link
              href={APP_ROUTES.REGISTER}
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
