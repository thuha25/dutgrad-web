"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

type Session = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
};

type SessionsListProps = {
  sessions: Session[];
  activeSession: string;
  onSessionClick: (sessionId: string) => void;
};

export default function SessionsList({
  sessions,
  activeSession,
  onSessionClick,
}: SessionsListProps) {
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors mb-1 ${
              session.id === activeSession ? "bg-muted" : ""
            }`}
            onClick={() => onSessionClick(session.id)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{session.title}</h3>
              <span className="text-xs text-muted-foreground">
                {formatDate(session.timestamp)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {session.lastMessage}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
