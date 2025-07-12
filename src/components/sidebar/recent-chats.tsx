import { useState, useEffect } from "react";
import { Clock, ChevronRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/api/chat.service";
import { ChatSession, RecentChat } from "./types";
import { RecentChatsList } from "./recent-chats-list";
import { slideInLeft } from "./animations";

interface RecentChatsProps {
  hasAnimated: boolean;
  getInitialAnimationState: (forceDisable?: boolean) => "visible" | "hidden";
}

export function RecentChats({
  hasAnimated,
  getInitialAnimationState,
}: RecentChatsProps) {
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentChats = async () => {
    if (isRecentChatsOpen) {
      try {
        setIsLoading(true);
        setError(null);
        const response = await chatService.getRecentChat();

        if (response && Array.isArray(response)) {
          const formattedChats = response.slice(0, 5).map((session: ChatSession) => {
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
        console.error("Failed to fetch recent chats:", error);
        setError("Failed to load recent chats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchRecentChats();
  }, [isRecentChatsOpen]);

  return (
    <motion.div
      variants={slideInLeft}
      initial={getInitialAnimationState()}
      animate="visible"
      transition={{ delay: 0.3 }}
      className="p-4 border-b"
    >
      <div className="flex items-center justify-between mb-2">
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          className="text-sm font-medium flex items-center hover:text-primary transition"
          onClick={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
        >
          <motion.div
            animate={{
              rotate: isRecentChatsOpen ? [0, 15, -15, 0] : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Clock className="mr-2 h-4 w-4" />
          </motion.div>
          Recent AI Chats
          <motion.span
            animate={{ rotate: isRecentChatsOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </motion.button>

        {isRecentChatsOpen && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={fetchRecentChats}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={cn("h-4 w-4", isLoading && "animate-spin")}
                    />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh chats</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <AnimatePresence>
        {isRecentChatsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-2 overflow-hidden"
            style={{ maxHeight: "300px" }}
          >
            <RecentChatsList
              isLoading={isLoading}
              error={error}
              recentChats={recentChats}
              fetchRecentChats={fetchRecentChats}
              hasAnimated={hasAnimated}
              maxHeight="250px" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
