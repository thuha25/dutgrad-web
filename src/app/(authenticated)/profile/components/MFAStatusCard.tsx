"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Check, AlertTriangle } from "lucide-react";
import { MFAEnableDialog } from "./MFAEnableDialog";
import { MFADisableDialog } from "./MFADisableDialog";

interface MFAStatusCardProps {
  mfaStatus: boolean;
  setMfaStatus: (status: boolean) => void;
  user: any;
  setUser: (user: any) => void;
}

export function MFAStatusCard({
  mfaStatus,
  setMfaStatus,
  user,
  setUser,
}: MFAStatusCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Two-Factor Authentication (2FA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/30 p-4 rounded-lg">
          <div className="flex items-start gap-4">
            <div
              className={`p-2 rounded-full ${
                mfaStatus
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {mfaStatus ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {mfaStatus
                  ? "Two-factor authentication is enabled"
                  : "Two-factor authentication is not enabled"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {mfaStatus
                  ? "Your account is protected with an additional layer of security. You'll need your phone to sign in."
                  : "Enable two-factor authentication for an additional layer of security when signing in."}
              </p>
            </div>
          </div>
        </div>

        {mfaStatus ? (
          <MFADisableDialog
            setMfaStatus={setMfaStatus}
            user={user}
            setUser={setUser}
          />
        ) : (
          <MFAEnableDialog setMfaStatus={setMfaStatus} />
        )}

        <div className="text-sm text-muted-foreground mt-4 bg-muted/20 p-4 rounded-lg">
          <h4 className="font-medium mb-2">
            What is two-factor authentication?
          </h4>
          <p>
            Two-factor authentication adds an additional layer of security to
            your account by requiring both your password and a verification code
            from your mobile phone when you sign in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
