"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";

interface GuideStep {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface GuideModalProps {
  isVisible: boolean;
  onClose: () => void;
  steps: GuideStep[];
  currentStep: number;
  onNext: () => void;
}

export function GuideModal({
  isVisible,
  onClose,
  steps,
  currentStep,
  onNext,
}: GuideModalProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card rounded-lg shadow-xl border border-border p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">{steps[currentStep].content}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-6 rounded-full ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button onClick={onNext}>
            {currentStep < steps.length - 1 ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
