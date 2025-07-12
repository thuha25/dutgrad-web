"use client";

import React from "react";
import { OfficeViewer } from "./office-viewer";

interface DocxViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function DocxViewer({ url, onLoadSuccess, onError }: DocxViewerProps) {
  return (
    <OfficeViewer
      url={url}
      title="Word document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      useGoogleViewer={false}
    />
  );
}
