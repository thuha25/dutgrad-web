"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { mfaService } from "@/services/api/mfa.service";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useAuth } from "@/context/auth.context";
import { Smartphone, Save, Copy, Check } from "lucide-react";

const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

interface MFASetupProps {
  onSuccess: () => void;
  onSkip: () => void;
}

export function MFASetup({ onSuccess, onSkip }: MFASetupProps) {
  const { user, setUser } = useAuth();
  const [setupData, setSetupData] = useState<{
    qrCode: string;
    backupCodes: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const verifyForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    initiateSetup();
  }, []);

  async function initiateSetup() {
    setIsLoading(true);
    try {
      const response = await mfaService.setupMFA();

      setSetupData({
        qrCode: response.qr_code_data_url,
        backupCodes: response.backup_codes,
      });
    } catch (error) {
      console.error("Failed to set up MFA:", error);
      toast.error("Failed to set up MFA. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerifySubmit(data: VerifyFormValues) {
    setIsLoading(true);
    try {
      await mfaService.verifyAndEnableMFA(data.code);

      if (user) {
        setUser({
          ...user,
          mfa_enabled: true,
        });
      }

      toast.success("MFA enabled successfully!");
      onSuccess();
    } catch (error) {
      console.error("Failed to verify MFA:", error);
      toast.error(
        "Failed to verify MFA. Please check your code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join("\n"));
      setCodeCopied(true);
      toast.success("Backup codes copied to clipboard");

      setTimeout(() => {
        setCodeCopied(false);
      }, 2000);
    }
  };

  if (!setupData) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <div className="bg-muted/70 border border-border rounded-lg p-4">
        <div className="flex gap-3">
          <Smartphone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your authenticator app, then enter the
              6-digit code below to verify.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex justify-center">
          <div className="p-3 bg-card rounded-lg shadow-sm border border-border">
            <Image
              src={setupData.qrCode || "/placeholder.svg"}
              alt="QR Code for MFA setup"
              width={480}
              height={480}
              className="rounded"
            />
          </div>
        </div>

        {setupData.backupCodes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center text-sm">
                <Save className="mr-2 h-4 w-4 text-muted-foreground" />
                Backup Codes
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 flex items-center gap-1.5 text-xs"
                onClick={copyToClipboard}
              >
                {codeCopied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {codeCopied ? "Copied" : "Copy All"}
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg border border-border p-3 h-[160px] overflow-y-auto">
              <div className="text-xs font-mono grid grid-cols-1 gap-2">
                {setupData.backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="p-1.5 bg-card rounded border border-border text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Save these backup codes in a secure place. Each code can only be
              used once.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-1">
        <Form {...verifyForm}>
          <form
            onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
            className="space-y-5"
          >
            <FormField
              control={verifyForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="text-center font-mono text-lg h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the 6-digit code from your authenticator app.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onSkip}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verifying...
                  </div>
                ) : (
                  "Verify and Enable"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
