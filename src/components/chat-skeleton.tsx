import { Bot } from "lucide-react";

export default function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted max-w-[80%] animate-pulse">
      <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
        <Bot className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-muted-foreground/20 rounded-md w-3/4"></div>
        <div className="h-4 bg-muted-foreground/20 rounded-md w-1/2"></div>
        <div className="h-4 bg-muted-foreground/20 rounded-md w-5/6"></div>
        <div className="h-4 bg-muted-foreground/20 rounded-md w-2/5"></div>
      </div>
    </div>
  );
}
