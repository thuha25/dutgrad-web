"use client";

import React, { useState, useEffect } from "react";
import { DocumentViewer } from "@/app/(authenticated)/documents/view/document-viewers";
import { Loader2 } from "lucide-react";
import { FaFilePdf, FaFileExcel, FaFileWord, FaFileCsv } from "react-icons/fa";
import { FileIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { documentService } from "@/services/api/document.service";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { DocumentHeader } from "./components/DocumentHeader";

interface DocumentDetails {
  id: number;
  name: string;
  s3_url: string;
  mime_type: string;
  spaceId: number;
}

import { detectFileType } from "./document-viewers/utils";

const DocumentIcon = ({
  mimeType,
  fileName = "",
}: {
  mimeType: string;
  fileName?: string;
}) => {
  const fileType = detectFileType(fileName, mimeType);

  switch (fileType) {
    case "pdf":
      return <FaFilePdf className="h-5 w-5 text-red-500" />;
    case "excel":
      return <FaFileExcel className="h-5 w-5 text-green-600" />;
    case "word":
      return <FaFileWord className="h-5 w-5 text-blue-600" />;
    case "csv":
      return <FaFileCsv className="h-5 w-5 text-blue-600" />;
    default:
      return <FileIcon className="h-5 w-5" />;
  }
};

export default function DocumentViewerPage() {
  const searchParams = useSearchParams();
  const documentId = searchParams.get("id");
  const [document, setDocument] = useState<DocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDocument, setLoadingDocument] = useState(true);
  const [showDirectDownload, setShowDirectDownload] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setError("Document ID is missing");
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        const response = await documentService.getDocumentById(
          parseInt(documentId)
        );
        setDocument(response as DocumentDetails);
        setLoading(false);

        const timer = setTimeout(() => setShowDirectDownload(true), 5000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        setError("Failed to load document");
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  useEffect(() => {
    if (document?.s3_url) {
      const timer = setTimeout(() => setLoadingDocument(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [document]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <div className="text-primary">Loading document information...</div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return <ErrorScreen errorMessage={error || "Document not found"} />;
  }

  const displayName =
    document.name.substring(0, document.name.lastIndexOf(".")) || document.name;
  return (
    <div className="min-h-screen w-full flex flex-col h-screen overflow-hidden">
      <DocumentHeader
        title={displayName}
        icon={
          <DocumentIcon
            mimeType={document.mime_type}
            fileName={document.name}
          />
        }
        downloadUrl={document.s3_url}
        downloadFileName={document.name}
      />

      <div className="flex-1 w-full h-full relative overflow-hidden">
        {loadingDocument ? (
          <LoadingScreen
            showDownload={showDirectDownload}
            downloadUrl={document.s3_url}
            downloadFileName={document.name}
          />
        ) : (
          <div className="h-full">
            <DocumentViewer
              url={document.s3_url}
              fileName={document.name}
              mimeType={document.mime_type}
            />
          </div>
        )}
      </div>
    </div>
  );
}
