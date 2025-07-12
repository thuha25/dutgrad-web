"use client";
import { useState, useEffect } from "react";
import { spaceService } from "@/services/api/space.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CheckCircle2,
  Info,
  Gauge,
  FileText,
  Upload,
  Loader2,
  Save,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/auth.context";

interface LimitsSettingsProps {
  spaceId: string;
  initialDocumentLimit: number;
  initialFileSizeLimitKb: number;
  initialApiCallLimit: number;
  onUpdate?: (spaceId: string) => void;
}

export function LimitsSettings({
  spaceId,
  initialDocumentLimit,
  initialFileSizeLimitKb,
  initialApiCallLimit,
  onUpdate,
}: LimitsSettingsProps) {
  const [documentLimit, setDocumentLimit] = useState(initialDocumentLimit);
  const [fileSizeLimitKb, setFileSizeLimitKb] = useState(
    initialFileSizeLimitKb
  );
  const [apiCallLimit, setApiCallLimit] = useState(initialApiCallLimit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const formattedFileSize = (fileSizeLimitKb / 1024).toFixed(2);

  const { tier } = useAuth();
  const formattedMaxFileSize = (
    (tier?.file_size_limit_kb || 10240) / 1024
  ).toFixed(2);

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

  const handleUpdateLimits = async () => {
    setIsSubmitting(true);
    setProgress(0);

    try {
      await spaceService.updateSpace(spaceId, {
        document_limit: documentLimit,
        file_size_limit_kb: fileSizeLimitKb,
        api_call_limit: apiCallLimit,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      toast.success("Limits updated successfully", {
        description: "Your changes have been saved",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error("Failed to update space limits:", error);
      toast.error("Failed to update limits", {
        description: "Please try again later",
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      });
    } finally {
      setIsSubmitting(false);
      if (onUpdate) {
        onUpdate(spaceId);
      }
    }
  };

  const handleFileSizeChange = (value: number[]) => {
    setFileSizeLimitKb(value[0]);
  };

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
      {isSubmitting && (
        <Progress value={progress} className="h-1 rounded-none" />
      )}

      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <CardTitle>Space Limits</CardTitle>
        </div>
        <CardDescription>Configure usage limits for this space</CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium">Document Limits</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="document-limit" className="text-sm font-medium">
                Maximum documents
              </Label>
              <span className="text-xs text-muted-foreground">
                Current: {documentLimit} documents
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Input
                id="document-limit"
                type="number"
                min="0"
                value={documentLimit}
                onChange={(e) =>
                  setDocumentLimit(parseInt(e.target.value) || 0)
                }
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">documents</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Set to 0 for unlimited documents
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium">File Size Limit</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="file-size-limit" className="text-sm font-medium">
                Maximum file size
              </Label>
              <span className="text-sm font-medium">
                {formattedFileSize} MB
              </span>
            </div>

            <Slider
              id="file-size-limit"
              defaultValue={[fileSizeLimitKb]}
              max={tier?.file_size_limit_kb || 10240} // 10MB in KB
              step={512}
              onValueChange={handleFileSizeChange}
              className="pt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>512 KB</span>
              <span>{formattedMaxFileSize} MB</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-base font-medium">API Usage Limits</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-call-limit" className="text-sm font-medium">
                API calls per day
              </Label>
              <span className="text-xs text-muted-foreground">
                Current: {apiCallLimit} calls
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Input
                id="api-call-limit"
                type="number"
                min="0"
                value={apiCallLimit}
                onChange={(e) => setApiCallLimit(parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">calls/day</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Set to 0 for unlimited API calls
            </p>
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
            onClick={handleUpdateLimits}
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
                Save Limits
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
