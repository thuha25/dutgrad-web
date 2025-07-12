export interface RecentChat {
  id: number;
  spaceId: number;
  spaceName: string;
  lastMessage: string;
  lastMessageType: "human" | "ai";
  timestamp: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  message: {
    type: "human" | "ai";
    content: string;
    tool_calls?: any[];
    additional_kwargs: Record<string, any>;
    response_metadata: Record<string, any>;
    invalid_tool_calls?: any[];
  };
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
  chat_histories: ChatMessage[];
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href?: string;
    title: string;
    icon: React.ReactNode;
    badge?: string;
    subItems?: {
      title: string;
      href: string;
      icon: React.ReactNode;
      badge?: string;
    }[];
  }[];
}

export interface SidebarProps {
  isMobile?: boolean;
  isOpen: boolean;
  onClose: () => void;
}
