import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      <Card className="z-10 w-full max-w-md overflow-hidden p-0 shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 bg-muted/50 p-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"} 
            size="sm" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
}
