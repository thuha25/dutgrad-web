import { Bot } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { slideInUp, staggerContainer } from "./animations";
import { RecentChat } from "./types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getRelativeTime, truncateText } from "@/components/utils/format";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentChatsListProps {
  isLoading: boolean;
  error: string | null;
  recentChats: RecentChat[];
  fetchRecentChats: () => void;
  hasAnimated: boolean;
  maxHeight?: string;
}

export function RecentChatsList({
  isLoading,
  error,
  recentChats,
  fetchRecentChats,
  maxHeight = "300px",
}: RecentChatsListProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                variants={slideInUp}
                className="flex items-center gap-3 p-2"
              >
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </motion.div>
            ))}
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2 text-sm text-red-500"
        >
          {error}
          <Button
            variant="link"
            size="sm"
            className="ml-2 h-auto p-0"
            onClick={fetchRecentChats}
          >
            Retry
          </Button>
        </motion.div>
      );
    }

    if (recentChats.length > 0) {
      return (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {recentChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              variants={slideInUp}
              custom={index}
              whileHover={{
                x: 5,
                backgroundColor: "rgba(var(--accent) / 0.3)",
              }}
              className="rounded-md transition-colors"
            >
              <Link
                href={`/spaces/${chat.spaceId}/chat?sessionId=${chat.id}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/40 transition-colors w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Bot className="h-4 w-4 text-primary" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-start">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 * index }}
                      className="text-xs text-muted-foreground"
                    >
                      {getRelativeTime(chat.timestamp)}
                    </motion.p>
                  </div>
                  <div className="flex items-center gap-1">
                    {chat.lastMessageType === "human" ? (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        You:{" "}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        AI:{" "}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {truncateText(chat.lastMessage, 40)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="text-center bg-primary/5 rounded-lg p-3"
        >
          <p className="text-sm text-muted-foreground">No recent chats found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start a new conversation in any space
          </p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <ScrollArea className="w-full" style={{ maxHeight }}>
      <div className="pr-3">{renderContent()}</div>
    </ScrollArea>
  );
}
