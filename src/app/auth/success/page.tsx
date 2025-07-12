"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeStateAction } from "./actions";
import { APP_ROUTES } from "@/lib/constants";
import { useAuth } from "@/context/auth.context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function SuccessCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-primary">
                Authentication
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
      <SuccessPage />
    </Suspense>
  );
}

function SuccessPage() {
  const router = useRouter();
  const { loginSuccess } = useAuth();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    const state = searchParams.get("state");

    if (!state) {
      setError("Invalid state parameter");
      setIsLoading(false);
      return;
    }

    const performStateExchange = async () => {
      try {
        const result = await exchangeStateAction(state);

        if (!result || !result.data) {
          setError(result?.error || "Authentication failed");
          setIsLoading(false);
          return;
        }

        const { token, is_new_user, user } = result.data;

        setIsLoading(false);
        setIsRedirecting(true);

        loginSuccess(token, user!);

        setTimeout(() => {
          if (is_new_user) {
            router.push("/complete-setup");
          } else {
            router.push(APP_ROUTES.DASHBOARD);
          }
        }, 500);
      } catch (err) {
        console.error("Authentication error:", err);
        setError("Authentication failed. Please try again.");
        setIsLoading(false);
      }
    };

    performStateExchange();
  }, [searchParams]);

  if (isRedirecting) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => router.push(APP_ROUTES.LOGIN)}
                variant="default"
              >
                Return to Login
              </Button>
            </div>
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
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 py-8">
          <div className="text-xl font-medium text-center">
            Authenticating...
          </div>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
