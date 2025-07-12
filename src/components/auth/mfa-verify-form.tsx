"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authService } from "@/services/api/auth.service";

interface MfaVerifyFormProps {
  tempToken: string;
  onSuccess: (accessToken: string, user: any) => void;
  onError: (message: string) => void;
  onBack: () => void;
  initialError?: string;
}

export default function MfaVerifyForm({
  tempToken,
  onSuccess,
  onError,
  onBack,
  initialError = "",
}: MfaVerifyFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(initialError);
  const [useBackupCode, setUseBackupCode] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const code = formData.get("code") as string;

      const result = await authService.verifyMFA(
        code,
        useBackupCode,
        tempToken
      );

      if (result.user && result.token) {
        onSuccess(result.token, result.user);
      } else {
        setError("Something went wrong. Please try again.");
        onError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 401
          ? "Invalid verification code. Please try again!"
          : "An unexpected error occurred. Please try again.";

      setError(errorMessage);
      onError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-muted-foreground">
          Enter the verification code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Authentication Code</Label>
          <Input
            id="code"
            name="code"
            placeholder="6-digit code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            autoFocus
            disabled={isLoading}
            required
            className="text-center tracking-wider text-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="useBackupCode"
            checked={useBackupCode}
            onCheckedChange={setUseBackupCode}
            disabled={isLoading}
          />
          <Label htmlFor="useBackupCode">Use backup code</Label>
        </div>
        {error && (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onBack}
          disabled={isLoading}
        >
          Back to Login
        </Button>
      </form>
    </div>
  );
}
