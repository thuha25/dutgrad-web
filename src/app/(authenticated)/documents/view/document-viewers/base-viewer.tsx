"use client";

import React, { useState, useRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface BaseViewerProps {
  url: string;
  title?: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
  googleViewerType?: boolean;
  errorTitle?: string;
  loadingText?: string;
}

export function BaseDocumentViewer({
  url,
  title = "Document",
  onLoadSuccess,
  onError,
  googleViewerType = false,
  errorTitle = "Cannot view document online",
  loadingText = "Loading document..."
}: BaseViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const viewerUrl = googleViewerType 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    : url;
  
  const handleIframeLoad = () => {
    setLoading(false);
    if (onLoadSuccess) onLoadSuccess();
  };
  
  const handleIframeError = () => {
    setLoading(false);
    setError(`Unable to load ${title}`);
    if (onError) onError(`Unable to load ${title}`);
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-muted/20">
        <div className="text-center max-w-md bg-background p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{errorTitle}</h2>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading {title}</AlertTitle>
              <AlertDescription>
                {error || "Unable to connect to the document source. Please try downloading the file to view."}
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setError(null);
                setLoading(true);
                if (iframeRef.current) {
                  iframeRef.current.src = viewerUrl;
                }
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <span className="text-lg font-medium">{loadingText}</span>
        </div>
      )}
      
      <iframe 
        ref={iframeRef}
        src={viewerUrl}
        className="w-full h-full border-0 flex-1"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={`${title} Viewer`}
        style={{ height: "calc(100% - 40px)", minHeight: "calc(100vh - 100px)" }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups"
      />
    </div>
  );
}