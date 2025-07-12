"use client";

import React from "react";
import { OfficeViewer } from "./office-viewer";

interface CSVViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function CSVViewer({ url, onLoadSuccess, onError }: CSVViewerProps) {
  return (
    <OfficeViewer
      url={url}
      title="CSV document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      useGoogleViewer={true}
    />
  );
}
