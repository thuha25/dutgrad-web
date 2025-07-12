import { CheckCircle2, FileText, Upload, AlertCircle } from "lucide-react";
import { ReactNode } from "react";

export interface ProcessingStage {
  title: string;
  description: string;
  icon: ReactNode;
  status: number;
}

export const PROCESSING_STAGES: ProcessingStage[] = [
  {
    title: "Upload Complete",
    description:
      "Your document has been successfully uploaded and is waiting to be processed.",
    icon: <Upload className="h-6 w-6 text-blue-500" />,
    status: 0,
  },
  {
    title: "Document Parsed",
    description: "We've extracted the text and structure from your document.",
    icon: <FileText className="h-6 w-6 text-yellow-500" />,
    status: 1,
  },
  {
    title: "Ready to Use",
    description:
      "Your document has been fully processed and is ready for searching and knowledge extraction.",
    icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
    status: 2,
  },
  {
    title: "Processing Failed",
    description:
      "There was an error processing your document. Please try uploading it again.",
    icon: <AlertCircle className="h-6 w-6 text-red-500" />,
    status: -1,
  },
];

export function calculateProgress(status: number) {
  if (status === -1) return 0;
  const normalStages = PROCESSING_STAGES.filter(stage => stage.status !== -1).length;
  
  if (status === 2) return 100;
  
  return Math.min(
    Math.round(((status + 1) / normalStages) * 100),
    100
  );
}
