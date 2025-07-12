"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Download } from "lucide-react";

interface PdfViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function PdfViewer({ url, onLoadSuccess, onError }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [useDirect, setUseDirect] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    url
  )}&embedded=true`;

  useEffect(() => {
    const isInternalUrl =
      url.startsWith("/") || url.includes(window.location.hostname);
    setUseDirect(isInternalUrl || url.length > 2000);
  }, [url]);

  const handleLoad = () => {
    setLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };
  const handleError = () => {
    if (!useDirect) {
      setUseDirect(true);
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      return;
    }

    setLoading(false);
    setError(true);
    const errorMessage = "Unable to load PDF document";
    if (onError) onError(errorMessage);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 bg-muted/20">
        <div className="text-center max-w-md bg-background p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Cannot view document</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load the PDF document.
          </p>
          <a
            href={url}
            download
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Loading PDF...</span>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={useDirect ? url : googleViewerUrl}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        title="PDF Viewer"
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
        style={{ height: "100%", minHeight: "calc(100vh - 60px)" }}
      />
    </div>
  );
}
