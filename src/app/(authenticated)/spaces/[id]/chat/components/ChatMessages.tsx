"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import ChatSkeleton from "@/components/chat-skeleton";
import { EmptyChatSuggestions } from "./EmptyChatSuggestions";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTempMessage?: boolean;
};

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isAtBottom: boolean;
  setIsAtBottom: (isAtBottom: boolean) => void;
  setInput: (input: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  sessionId?: string | null;
  loadChatHistory?: () => Promise<void>;
}

export function ChatMessages({
  messages,
  isLoading,
  isAtBottom,
  setIsAtBottom,
  setInput,
  inputRef,
  sessionId,
  loadChatHistory,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isAtBottom]);

  useEffect(() => {
    if (sessionId && loadChatHistory) {
      loadChatHistory();
    }
  }, [sessionId, loadChatHistory]);

  useEffect(() => {
    const handleScrollEvent = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 10;
        setIsAtBottom(isBottom);
      }
    };

    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScrollEvent);
      return () =>
        scrollElement.removeEventListener("scroll", handleScrollEvent);
    }
  }, [setIsAtBottom]);

  return (
    <div className="flex-1 overflow-hidden relative w-full">
      <ScrollArea
        className="h-[calc(100vh-18rem)] w-full overflow-x-hidden"
        ref={scrollAreaRef}
      >
        <div className="p-4 space-y-6 w-full overflow-x-hidden">
          {messages.length === 0 ? (
            <EmptyChatSuggestions setInput={setInput} inputRef={inputRef} />
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="w-full flex flex-col overflow-hidden"
              >
                <ChatMessage message={message} />
              </motion.div>
            ))
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ChatSkeleton />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {!isAtBottom && messages.length > 2 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 right-4"
        >
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full h-10 w-10 p-0 shadow-lg"
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
              });
              setIsAtBottom(true);
            }}
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
