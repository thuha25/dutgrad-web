import { FileQuestion, ZapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface EmptyChatSuggestionsProps {
  setInput: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function EmptyChatSuggestions({
  setInput,
  inputRef,
}: EmptyChatSuggestionsProps) {
  const suggestions = [
    "List available documents",
    "Summarize latest document",
    "Show main document topics",
    "Search for specific terms",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-[50vh] text-center"
    >
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Start a conversation
      </h3>
      <p className="max-w-md text-muted-foreground mb-8">
        Send a message to begin chatting with the AI assistant about documents
        in this space.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, i) => (
          <Button
            key={i}
            variant="outline"
            className="text-sm justify-start h-auto py-3 px-4"
            onClick={() => {
              setInput(suggestion);
              inputRef.current?.focus();
            }}
          >
            <ZapIcon className="h-3.5 w-3.5 mr-2 text-primary" />
            {suggestion}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
