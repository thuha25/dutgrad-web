import { AlertCircle, Brain, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StageProps {
  stage: {
    title: string;
    description: string;
    icon: ReactNode;
    status: number;
  };
  documentStatus: number;
}

export function ProcessingStage({ stage, documentStatus }: StageProps) {
  const isActive = documentStatus === stage.status;
  const isCompleted = documentStatus > 0 && documentStatus > stage.status;
  const isPending = documentStatus >= 0 && documentStatus < stage.status;
  const isFinalStageCompleted = stage.status === 2 && documentStatus === 2;
  const isErrorState = documentStatus === -1 && stage.status === -1;

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg transition-colors",
        isActive && "bg-primary/10 border border-primary/20",
        isCompleted && "bg-muted/30",
        isErrorState && "bg-destructive/10 border border-destructive/20",
        isPending && "opacity-60"
      )}
    >
      <div className="mt-1">
        {isCompleted || isFinalStageCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        ) : isErrorState ? (
          <AlertCircle className="h-6 w-6 text-destructive" />
        ) : isActive ? (
          stage.status === 1 ? (
            <Brain className="h-6 w-6 text-primary animate-pulse" />
          ) : (
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          )
        ) : (
          stage.icon
        )}
      </div>
      <div className="space-y-1">
        <h3
          className={cn(
            "text-lg font-medium",
            isActive && "text-primary font-semibold",
            isErrorState && "text-destructive font-semibold"
          )}
        >
          {stage.title}
          {isActive && !isErrorState && " (In Progress)"}
          {isErrorState && " (Error)"}
          {(isCompleted || isFinalStageCompleted) && !isErrorState
            ? " (Completed)"
            : ""}
        </h3>
        <p className="text-muted-foreground">{stage.description}</p>
        {isActive && stage.status === 0 && (
          <p className="text-xs text-primary mt-2">
            Extracting text and structure from your document...
          </p>
        )}
        {isActive && stage.status === 1 && (
          <p className="text-xs text-primary mt-2">
            Creating knowledge graph and enhancing searchability...
          </p>
        )}
      </div>
    </div>
  );
}
