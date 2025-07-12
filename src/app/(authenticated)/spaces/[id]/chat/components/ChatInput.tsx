import { KeyboardEvent, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  sessionId: string | null;
  historyIndex: number;
  queryHistory: string[];
  setHistoryIndex: (index: number) => void;
}

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  isLoading,
  sessionId,
  historyIndex,
  queryHistory,
  setHistoryIndex,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }

    if (e.key === "ArrowUp" && !e.shiftKey && input === "") {
      e.preventDefault();
      if (queryHistory.length > 0) {
        const newIndex =
          historyIndex + 1 < queryHistory.length
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(queryHistory[newIndex] || "");
      }
    }

    if (e.key === "ArrowDown" && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(queryHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  return (
    <Card className="rounded-none border-x-0 border-b-0 shadow-lg">
      <CardContent className="p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2 w-full">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= 1024) {
                  setInput(e.target.value);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your question... (Shift+Enter for new line, Up/Down for history)"
              className="resize-none min-h-[60px] max-h-[150px] bg-background/50 focus-visible:ring-primary/30 pl-4 pr-12 py-3"
              disabled={!sessionId || isLoading}
              maxLength={1024}
            />
            <div className="absolute bottom-2 right-3 text-xs text-muted-foreground flex items-center gap-2">
              {historyIndex > -1 && (
                <span className="mr-2">
                  History: {historyIndex + 1}/{queryHistory.length}
                </span>
              )}
              <span className={cn(
                input.length > 900 && input.length <= 1000 ? "text-amber-500" : "",
                input.length > 1000 ? "text-red-500 font-medium" : ""
              )}>
                {input.length}/1024
              </span>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !sessionId}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow transition-all duration-200 h-[60px] w-[60px]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
