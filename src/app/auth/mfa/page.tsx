"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { APP_ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MfaVerifyForm from "@/components/auth/mfa-verify-form";

function MfaVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSuccess } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  // Get the state param directly from URL - this will be our tempToken
  const tempToken = searchParams.get("state");

  function handleSuccess(accessToken: string, user: any) {
    loginSuccess(accessToken, user);
    setIsSuccess(true);

    // Small delay for showing success message before redirecting
    setTimeout(() => {
      router.push(APP_ROUTES.DASHBOARD);
    }, 1000);
  }

  function handleError(message: string) {
    console.error(message);
  }

  function onBackToLogin() {
    router.push(APP_ROUTES.LOGIN);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Authentication Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 py-8">
            <div className="text-xl font-medium text-center">
              Redirecting to dashboard...
            </div>
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!tempToken ? (
            <div className="text-center">
              No authentication token provided. Please try again.
            </div>
          ) : (
            <MfaVerifyForm
              tempToken={tempToken}
              onSuccess={handleSuccess}
              onError={handleError}
              onBack={onBackToLogin}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component with Suspense boundary
export default function MfaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-primary">
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-8">
              <div className="text-xl font-medium text-center">Loading...</div>
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      }
    >
      <MfaVerification />
    </Suspense>
  );
}
