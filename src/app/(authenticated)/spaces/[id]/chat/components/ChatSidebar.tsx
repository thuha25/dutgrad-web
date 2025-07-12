import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Bot, Clock, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/api/chat.service";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ChatSession {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
  chat_histories: any[];
}

interface RecentChat {
  id: number;
  spaceId: number;
  spaceName: string;
  lastMessage: string;
  lastMessageType: "human" | "ai";
  timestamp: string;
}

interface ChatSidebarProps {
  sessionId: string | null;
}

export function ChatSidebar({ sessionId }: ChatSidebarProps) {
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<number | null>(null);

  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateText = (text: string, maxLength = 50): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const fetchSessionHistory = async () => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);
      const response = await chatService.getRecentChat();

      if (response && Array.isArray(response)) {
        const formattedChats = response.map((session: ChatSession) => {
          const chatHistories = session.chat_histories || [];
          const lastChatMessage =
            chatHistories.length > 0
              ? chatHistories[chatHistories.length - 1]
              : null;

          const lastMessageContent = lastChatMessage
            ? lastChatMessage.message.content
            : "No messages yet";

          let spaceName = "Chat Session";
          if (session.space && session.space.name) {
            spaceName = session.space.name;
          } else {
            spaceName = `Chat Session ${session.id}`;
          }

          return {
            id: session.id,
            spaceId: session.space_id,
            spaceName: spaceName,
            lastMessage: lastMessageContent,
            lastMessageType: lastChatMessage?.message.type || "human",
            timestamp: lastChatMessage?.created_at || session.created_at,
          } as RecentChat;
        });

        formattedChats.sort(
          (a: RecentChat, b: RecentChat) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setRecentChats(formattedChats);
      }
    } catch (error) {
      setHistoryError("Failed to load chat history. Please try again.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSessionHistory();
  }, []);
  const handleDeleteSession = async () => {
    if (!chatToDelete) return;

    try {
      await chatService.clearChatHistory(chatToDelete);
      setRecentChats((prevChats) =>
        prevChats.filter((chat) => chat.id !== chatToDelete)
      );
      toast.success("Chat session deleted successfully");

      if (Number(sessionId) === chatToDelete) {
        const spaceId = recentChats.find(
          (chat) => chat.id === chatToDelete
        )?.spaceId;
        if (spaceId) {
          try {
            const newSession = await chatService.beginChatSession(spaceId);
            if (newSession && newSession.id) {
              toast.success("New chat session created");
              window.location.href = `/spaces/${spaceId}/chat?sessionId=${newSession.id}`;
            }
          } catch (error) {
            console.error("Failed to create new session:", error);
            toast.error("Failed to create new chat session. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete chat session:", error);
      toast.error("Failed to delete chat session. Please try again.");
    } finally {
      setIsConfirmDeleteOpen(false);
      setChatToDelete(null);
    }
  };

  const filteredChats = recentChats.filter(
    (chat) =>
      chat.spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded hidden md:flex flex-col w-72 border-l border-border bg-background/50 mt-5 h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Chat History</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={fetchSessionHistory}
                  disabled={isLoadingHistory}
                >
                  <RefreshCw
                    className={cn(
                      "h-4 w-4",
                      isLoadingHistory && "animate-spin"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh chat history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chat history..."
              className="pl-9 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 h-full overflow-auto">
          <div className="p-2 space-y-1 pr-3">
            {isLoadingHistory ? (
              <div className="space-y-2 p-2">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : historyError ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-500 mb-2">{historyError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={fetchSessionHistory}
                >
                  Try Again
                </Button>
              </div>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{
                    x: 3,
                    backgroundColor: "rgba(var(--muted) / 0.3)",
                  }}
                  className={cn(
                    "rounded-md p-2 cursor-pointer transition-colors group",
                    Number(sessionId) === chat.id && "bg-accent"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div
                      className="flex-1 min-w-0 space-y-1"
                      onClick={() =>
                        router.push(
                          `/spaces/${chat.spaceId}/chat?sessionId=${chat.id}`
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate max-w-[120px]">
                          {chat.spaceName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(chat.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {chat.lastMessageType === "human" ? "You: " : "AI: "}
                        {truncateText(chat.lastMessage, 60)}
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatToDelete(chat.id);
                              setIsConfirmDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete chat session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))
            ) : recentChats.length > 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No matching chats found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No chat history yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a new conversation to see your history here
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteSession}
        title="Delete Chat Session"
        description="Are you sure you want to delete this chat session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
