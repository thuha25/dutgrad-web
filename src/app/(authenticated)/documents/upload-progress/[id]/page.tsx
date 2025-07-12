"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { documentService } from "@/services/api/document.service";
import { PROCESSING_STAGES, calculateProgress } from "../constants";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { ProcessingError } from "../components/ProcessingError";
import { ProcessingProgress } from "../components/ProcessingProgress";

interface Document {
  id: number;
  title: string;
  description?: string;
  processing_status: number;
  created_at: string;
  updated_at: string;
  space_id: number;
}

export default function DocumentUploadProgressPage() {
  const params = useParams();
  const documentId = params?.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const fetchDocument = useCallback(async () => {
    try {
      if (!documentId) return;

      if (document && document.processing_status === 2) return;

      const response = await documentService.getDocumentById(
        parseInt(documentId)
      );

      if (response) {
        const documentData = response as Document;
        setDocument(documentData);
        setProgressPercent(calculateProgress(documentData.processing_status));
      } else {
        throw new Error("Failed to fetch document data");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Failed to load document progress. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [documentId, document]);

  useEffect(() => {
    fetchDocument();

    const intervalId = setInterval(() => {
      fetchDocument();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchDocument]);
  
  const isProcessingError = document?.processing_status === -1;

  if (loading && !document) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  if (isProcessingError) {
    return <ProcessingError document={document} />;
  }

  return (
    <ProcessingProgress
      document={document}
      progressPercent={progressPercent}
      processingStages={PROCESSING_STAGES}
    />
  );
}
