"use client";
import { useState, useEffect } from "react";
import { spaceService } from "@/services/api/space.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Lock,
  Globe,
  CheckCircle2,
  Info,
  Settings2,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface GeneralSettingsProps {
  spaceId: string;
  initialName: string;
  initialDescription: string;
  initialPrivacyStatus: boolean;
  initialSystemPrompt?: string;
  onUpdate?: (spaceId: string) => void
}

export function GeneralSettings({
  spaceId,
  initialName,
  initialDescription,
  initialPrivacyStatus,
  initialSystemPrompt = "You are an AI assistant for answering questions about documents in this space. Provide helpful, accurate, and concise information based on the content available.",
  onUpdate,
}: GeneralSettingsProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [systemPrompt, setSystemPrompt] = useState(initialSystemPrompt);
  const [privacyStatus, setPrivacyStatus] = useState(
    initialPrivacyStatus ? "private" : "public"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [systemPromptError, setSystemPromptError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isSubmitting]);
  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Space name is required");
      isValid = false;
    } else if (name.length > 50) {
      setNameError("Space name must be less than 50 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!description.trim()) {
      setDescriptionError("Description is required");
      isValid = false;
    } else if (description.length > 500) {
      setDescriptionError("Description must be less than 500 characters");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (systemPrompt && systemPrompt.length > 1024) {
      setSystemPromptError("System prompt must be less than 1024 characters");
      isValid = false;
    } else {
      setSystemPromptError("");
    }

    return isValid;
  };
  const handleUpdateSpace = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    try {
      await spaceService.updateSpace(spaceId, {
        name,
        description,
        privacy_status: privacyStatus === "private",
        system_prompt: systemPrompt,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      toast.success("Space updated successfully", {
        description: "Your changes have been saved",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Failed to update space:", error);
      toast.error("Failed to update space", {
        description: "Please try again later",
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    } finally {
      setIsSubmitting(false);
      if(onUpdate) {
        onUpdate(spaceId)
      }
    }
  };

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
      {isSubmitting && (
        <Progress value={progress} className="h-1 rounded-none" />
      )}

      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <CardTitle>General Information</CardTitle>
        </div>
        <CardDescription>Basic details about your space</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name" className="text-sm font-medium">
              Space Name
            </Label>
            <span className="text-xs text-muted-foreground">
              {name.length}/50
            </span>
          </div>

          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim()) setNameError("");
            }}
            placeholder="Enter space name"
            className={
              nameError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />

          <AnimatePresence>
            {nameError && (
              <motion.div
                className="flex items-center gap-2 text-sm font-medium text-destructive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertTriangle size={14} />
                {nameError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <span className="text-xs text-muted-foreground">
              {description.length}/500
            </span>
          </div>

          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) setDescriptionError("");
            }}
            placeholder="Enter space description"
            rows={4}
            className={
              descriptionError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />

          <AnimatePresence>
            {descriptionError && (
              <motion.div
                className="flex items-center gap-2 text-sm font-medium text-destructive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertTriangle size={14} />
                {descriptionError}
              </motion.div>
            )}
          </AnimatePresence>        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="systemPrompt" className="text-sm font-medium">
              System Prompt
            </Label>
            <span className="text-xs text-muted-foreground">
              {systemPrompt ? systemPrompt.length : 0}/1024
            </span>
          </div>

          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => {
              setSystemPrompt(e.target.value);
              if (e.target.value.length <= 1024) setSystemPromptError("");
            }}
            placeholder="Enter system prompt for the chatbot in this space"
            rows={6}
            className={
              systemPromptError
                ? "border-destructive focus-visible:ring-destructive/30"
                : ""
            }
          />
          
          <p className="text-xs text-muted-foreground mt-1">
            This defines how the AI assistant will behave when users interact with documents in this space.
          </p>

          <AnimatePresence>
            {systemPromptError && (
              <motion.div
                className="flex items-center gap-2 text-sm font-medium text-destructive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AlertTriangle size={14} />
                {systemPromptError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-3">Privacy Settings</h3>
          <div className="bg-muted/40 rounded-lg p-4">
            <RadioGroup
              value={privacyStatus}
              onValueChange={setPrivacyStatus}
              className="flex flex-col space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="flex h-5 items-center">
                  <RadioGroupItem value="public" id="public" />
                </div>
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-primary" />
                    <Label htmlFor="public" className="font-medium">
                      Public
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Anyone can find and join this space. The space will be
                    visible in public listings.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex h-5 items-center">
                  <RadioGroupItem value="private" id="private" />
                </div>
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-primary" />
                    <Label htmlFor="private" className="font-medium">
                      Private
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only invited members can access this space. The space will
                    not be visible in public listings.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Info size={14} />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
              >
                <CheckCircle2 size={14} />
                Saved successfully
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            className="flex items-center gap-2 min-w-[120px]"
            onClick={handleUpdateSpace}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
