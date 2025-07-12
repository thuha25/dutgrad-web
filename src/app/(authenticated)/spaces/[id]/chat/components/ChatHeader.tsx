import { useState } from "react";
import { Bot, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ChatHeaderProps {
  onClearChat: () => void;
  onNewChat: () => void;
}

export function ChatHeader({ onClearChat, onNewChat }: ChatHeaderProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClearClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmClear = () => {
    setIsConfirmOpen(false);
    onClearChat();
  };

  return (
    <Card className="rounded border-x-0 border-t-0 shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Ask me about documents in this space
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onNewChat}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New chat session</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleClearClick}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear chat history</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmClear}
            title="Clear Chat History"
            description="Are you sure you want to clear all chat history? This action cannot be undone."
            confirmText="Clear"
            cancelText="Cancel"
            variant="destructive"
          />
        </div>
      </CardContent>
    </Card>
  );
}
