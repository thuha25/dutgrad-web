import { Download, Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  showDownload?: boolean;
  downloadUrl?: string;
  downloadFileName?: string;
}

export function LoadingScreen({ 
  message = "Loading document...", 
  subMessage = "This may take a few seconds for large documents",
  showDownload = false,
  downloadUrl = "",
  downloadFileName = "document"
}: LoadingScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-500 mt-2">{subMessage}</p>
      )}
      
      {showDownload && downloadUrl && (
        <div className="mt-6 text-center max-w-md">
          <p className="text-sm text-primary mb-3">
            Taking too long? You can download the file directly and open it with an application on your computer.
          </p>
          <a
            href={downloadUrl}
            download={downloadFileName}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            <Download size={16} />
            <span>Download now</span>
          </a>
        </div>
      )}
    </div>
  );
}
