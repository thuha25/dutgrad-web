"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MFASetup } from "@/app/complete-setup/components/mfa-setup";
import { toast } from "sonner";

interface MFAEnableDialogProps {
  setMfaStatus: (status: boolean) => void;
}

export function MFAEnableDialog({ setMfaStatus }: MFAEnableDialogProps) {
  const [showMfaDialog, setShowMfaDialog] = useState(false);

  const handleMfaSetupSuccess = () => {
    setMfaStatus(true);
    setShowMfaDialog(false);
    toast.success("MFA enabled successfully!");
  };

  return (
    <Dialog open={showMfaDialog} onOpenChange={setShowMfaDialog}>
      <DialogTrigger asChild>
        <Button className="w-full">Set Up Two-Factor Authentication</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            Enhance your account security with two-factor authentication
          </DialogDescription>
        </DialogHeader>

        {showMfaDialog && (
          <MFASetup
            onSuccess={handleMfaSetupSuccess}
            onSkip={() => setShowMfaDialog(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
