"use client";

import React from "react";
import { BaseDocumentViewer } from "./base-viewer";

interface OfficeViewerProps {
  url: string;
  title: string;
  useGoogleViewer?: boolean;
  onLoadSuccess?: () => void;
  onError?: (error: string) => void;
}

export function OfficeViewer({
  url,
  title,
  useGoogleViewer = false,
  onLoadSuccess,
  onError,
}: OfficeViewerProps) {
  const viewerUrl = useGoogleViewer
    ? url
    : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        url
      )}`;

  return (
    <BaseDocumentViewer
      url={viewerUrl}
      title={title}
      onLoadSuccess={onLoadSuccess}
      onError={onError}
      loadingText={`Loading ${title}...`}
      errorTitle={`Cannot view ${title} online`}
      googleViewerType={useGoogleViewer}
    />
  );
}
