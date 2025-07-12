import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { ProcessingStage } from "./ProcessingStage";
import { ReactNode } from "react";

interface Document {
  id: number;
  title?: string;
  processing_status: number;
  space_id: number;
}

interface ProcessingProgressProps {
  document: Document | null;
  progressPercent: number;
  processingStages: {
    title: string;
    description: string;
    icon: ReactNode;
    status: number;
  }[];
}

export function ProcessingProgress({
  document,
  progressPercent,
  processingStages,
}: ProcessingProgressProps) {
  const router = useRouter();
  const isComplete = document?.processing_status === 2;

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Document Processing</CardTitle>
          {document?.title && (
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              {document.title}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="space-y-6">
            {processingStages
              .filter((stage) =>
                document?.processing_status === -1
                  ? stage.status === -1
                  : stage.status !== -1
              )
              .map((stage, index) => (
                <ProcessingStage
                  key={index}
                  stage={stage}
                  documentStatus={document?.processing_status || 0}
                />
              ))}
          </div>

          {!isComplete && (
            <p className="text-sm text-center text-muted-foreground">
              This process may take a few minutes depending on the document size
              and complexity.
            </p>
          )}
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          {isComplete ? (
            <>
              <Button
                onClick={() => router.push(`/documents/view?id=${document.id}`)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                View Document
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/spaces/${document.space_id}`)}
              >
                Return to Space
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/spaces/${document?.space_id}`)}
            >
              Continue in Background
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
