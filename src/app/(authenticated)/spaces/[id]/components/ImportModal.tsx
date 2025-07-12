"use client";

import type React from "react";

import { useState, type ReactNode, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { FaPlus, FaFileUpload } from "react-icons/fa";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { documentService } from "@/services/api/document.service";
import { useRouter, useSearchParams } from "next/navigation";
import { ALLOWED_FILE_TYPES, APP_ROUTES, SPACE_ROLE } from "@/lib/constants";
import { useSpace } from "@/context/space.context";
import { cn } from "@/lib/utils";

interface ImportDialogProps {
  spaceId: string;
  children?: ReactNode;
}

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  xls: ["application/vnd.ms-excel"],
  xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  txt: ["text/plain"],
};

export default function ImportDialog({ spaceId, children }: ImportDialogProps) {
  const { role } = useSpace();
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    const openImport = searchParams.get("openImport");
    if (openImport === "true") {
      setIsOpen(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("openImport");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);
  const form = useForm({
    defaultValues: {
      file: undefined as unknown as FileList,
      description: "",
    },
  });

  const getCorrectMimeType = (file: File): string => {
    const extension = file.name.toLowerCase().split(".").pop();

    if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed" ||
      file.type === "application/octet-stream"
    ) {
      if (extension === "docx") {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      if (extension === "xlsx") {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }
    }

    return file.type;
  };

  const validateFileType = (file: File): boolean => {
    if (ALLOWED_FILE_TYPES[file.type]) {
      return true;
    }

    const extension = file.name.toLowerCase().split(".").pop();
    if (!extension) return false;

    if (
      (file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.type === "application/octet-stream") &&
      (extension === "xlsx" || extension === "docx")
    ) {
      return true;
    }

    if (ALLOWED_EXTENSIONS[extension]) {
      return true;
    }

    return false;
  };
  const handleFileUpload = async (data: {
    file: FileList;
    description: string;
  }) => {
    try {
      setFeedback({ type: null, message: "" });
      setIsUploading(true);
      setUploadProgress(0);

      let file = data.file?.[0];

      if (!file) {
        setFeedback({
          type: "error",
          message: "Please select a file to upload.",
        });
        setIsUploading(false);
        return;
      }

      if (!validateFileType(file)) {
        setFeedback({
          type: "error",
          message: `File type not supported. Please upload one of the following formats: PDF, DOC, DOCX, XLS, XLSX, CSV or TXT.`,
        });
        setIsUploading(false);
        return;
      }

      const correctMimeType = getCorrectMimeType(file);
      if (correctMimeType !== file.type) {
        file = new File([file], file.name, { type: correctMimeType });
        console.log(`Converted file MIME type to: ${correctMimeType}`);
      }

      console.log(correctMimeType);

      const response = await documentService.uploadDocument(
        Number.parseInt(spaceId),
        file,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
        data.description
      );

      if (response.data.status === 200 || response.data.status === 201) {
        setFeedback({
          type: "success",
          message: response.data.message || "Document uploaded successfully.",
        });

        form.reset();

        const document = response.data.data.document;
        const docId = document.id;

        setTimeout(() => {
          setIsOpen(false);
          setFeedback({ type: null, message: "" });
          router.push(APP_ROUTES.DOCUMENT.UPLOAD_PROGRESS(docId));
        }, 1000);
      } else {
        throw new Error(response.data.message || "Failed to upload document");
      }
    } catch (error: any) {
      console.error("Document upload error:", error);

      let errorMessage = "Failed to upload document. Please try again.";

      if (error.response) {
        if (error.response.status === 413) {
          errorMessage = "File is too large. Please upload a smaller document.";
        } else if (error.response.status === 415) {
          errorMessage =
            "Unsupported file type. Please check the supported formats and try again.";
        } else if (
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          errorMessage =
            "You don't have permission to upload documents to this space.";
        } else if (error.response.status === 429) {
          errorMessage =
            "Too many upload requests. Please wait a moment and try again.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error occurred. Please try again later.";
        } else if (error.response.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.error ||
            errorMessage;
        }
      } else if (error instanceof Error) {
        if (
          error.message.includes("network") ||
          error.message.includes("connection")
        ) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      setFeedback({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFeedback({ type: null, message: "" });
      form.reset();
      setIsDragging(false);
      setUploadProgress(0);
    }
    setIsOpen(open);
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        form.setValue("file", e.dataTransfer.files);
      }
    },
    [form]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children
          ? children
          : (role?.id === SPACE_ROLE.OWNER ||
              role?.id === SPACE_ROLE.EDITOR) && (
              <Button variant="outline" className="flex items-center gap-2">
                <FaPlus size={16} />
                <span>Import</span>
              </Button>
            )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Import Document</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Upload a document and add a description to improve processing accuracy
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4 lg:space-y-0 flex flex-col lg:flex-row gap-6"
            onSubmit={form.handleSubmit(handleFileUpload)}
          >
            <div className="flex-1 space-y-4">
            <FormField
              name="file"
              control={form.control}
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Document</FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors",
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25 hover:border-primary/50",
                        isUploading && "opacity-50 cursor-not-allowed"
                      )}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() =>
                        !isUploading &&
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <div className="flex flex-col items-center justify-center gap-2 max-w-full">
                        <FaFileUpload className="h-10 w-10 text-muted-foreground/50 flex-shrink-0" />
                        <div className="w-full max-w-[280px] text-center">
                          {value && value[0] ? (
                            <p
                              className="text-sm font-medium truncate overflow-hidden text-ellipsis"
                              title={value[0].name}
                            >
                              {value[0].name}
                            </p>
                          ) : (
                            <p className="text-sm font-medium">
                              Drag and drop your file here or click to browse
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV
                        </p>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                        onChange={(e) => onChange(e.target.files)}
                        disabled={isUploading}
                        className="hidden"
                        {...fieldProps}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                <FormLabel>
                    <div className="flex items-center justify-between">
                      <span>Document Description</span>
                      <span className="text-xs text-muted-foreground ml-4">Recommended</span>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the content of your document to improve AI processing accuracy..."
                      maxLength={1024}
                      disabled={isUploading}
                      className="min-h-[180px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    A detailed description helps our AI better understand your document content.
                    See the guidelines on the right for examples.
                  </p>
                </FormItem>
              )}
            />

            {isUploading && (
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {feedback.type === "success" && (
              <Alert
                variant="default"
                className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}

            {feedback.type === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            )}
            <DialogFooter className="sm:justify-start gap-2">
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
            </div>
            
            <div className="flex-1 border-l-0 lg:border-l border-border pl-0 lg:pl-6">
              <div className="bg-muted/40 rounded-lg p-4 h-full">
                <h3 className="text-lg font-medium mb-4">How to Write an Effective Description</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold">📝 Why Descriptions Matter</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      A good description helps our AI better understand and process your document, 
                      improving the accuracy of answers from the ChatBot.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold">📄 For Document Files (PDF, DOC, DOCX, TXT)</h4>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-4 space-y-1">
                      <li>Summarize the main topic or purpose</li>
                      <li>Mention important sections or chapters</li>
                      <li>List key information the document contains</li>
                      <li>Explain any technical terms or jargon</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold">📊 For Spreadsheets (XLS, XLSX, CSV)</h4>
                    <ul className="text-sm text-muted-foreground mt-1 list-disc pl-4 space-y-1">
                      <li>Describe what each column represents</li>
                      <li>Explain the meaning of different sheets</li>
                      <li>Detail any data formatting or calculations</li>
                      <li>Mention date ranges or data collection periods</li>
                    </ul>
                  </div>
                  
                  <div className="bg-secondary/30 p-3 rounded-md border border-secondary mt-2">
                    <h4 className="text-xs font-semibold mb-1">Example Descriptions:</h4>
                    <p className="text-xs italic mb-2">
                      &quot;This is our Q1 2025 Sales Report. Pages 1-3 contain the executive summary. The table on page 5 shows revenue by product category. Charts on pages 7-10 compare performance to previous quarters.&quot;
                    </p>
                    <p className="text-xs italic">
                      &quot;Excel file with 2025 financial data. Sheet 1 (Overview): Column A is date, B is revenue, C is expenses. Sheet 2 (Customers): Column A is customer ID, B is total purchase value, C is acquisition date.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
