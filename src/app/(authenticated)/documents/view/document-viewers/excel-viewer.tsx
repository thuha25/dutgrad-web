"use client";

import React from "react";
import { OfficeViewer } from "./office-viewer";

interface ExcelViewerProps {
  url: string;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ExcelViewer({ url, onLoadSuccess, onError }: ExcelViewerProps) {
  return (
    <OfficeViewer
      url={url}
      title="Excel document"
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      useGoogleViewer={false}
    />
  );
}
