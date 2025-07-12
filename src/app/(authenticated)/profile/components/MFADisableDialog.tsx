"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { mfaService } from "@/services/api/mfa.service";
import { toast } from "sonner";

interface MFADisableDialogProps {
  setMfaStatus: (status: boolean) => void;
  user: any;
  setUser: (user: any) => void;
}

export function MFADisableDialog({
  setMfaStatus,
  user,
  setUser,
}: MFADisableDialogProps) {
  const [disableMfaDialogOpen, setDisableMfaDialogOpen] = useState(false);

  const handleDisableMfa = async () => {
    try {
      await mfaService.disableMFA();

      setMfaStatus(false);
      setDisableMfaDialogOpen(false);
      if (user) {
        setUser({
          ...user,
          mfa_enabled: false,
        });
      }
      toast.success("MFA has been disabled");
    } catch (error) {
      console.error("Failed to disable MFA:", error);
      toast.error("Failed to disable MFA. Please try again.");
    }
  };

  return (
    <Dialog open={disableMfaDialogOpen} onOpenChange={setDisableMfaDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Disable Two-Factor Authentication
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            This will make your account less secure. Are you sure you want to
            continue?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert variant="destructive">
            <AlertDescription>
              {`Disabling two-factor authentication will remove the additional security layer 
              from your account. You'll no longer need an authenticator app to sign in.`}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDisableMfaDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDisableMfa}>
            Disable 2FA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
