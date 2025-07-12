import { apiClient } from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "@/lib/constants";

interface BeginSessionResponse {
  id: number;
  user_id: number;
  space_id: number;
  created_at: string;
  updated_at: string;
  user: any;
  space: any;
  user_query: any;
}

interface ChatQueryResponse {
  answer: string;
  query: {
    id: number;
    query_session_id: number;
    query: string;
    created_at: string;
    updated_at: string;
    user_query_session: {
      id: number;
      user_id: number;
      space_id: number;
      created_at: string;
      updated_at: string;
      user: any;
      space: any;
      user_query: any;
    };
  };
}

interface ChatHistoryMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const chatService = {
  beginChatSession: async (spaceId: number): Promise<BeginSessionResponse> => {
    const response = await apiClient.post(API_ROUTES.CHAT.BEGIN_SESSION, {
      space_id: spaceId,
    });
    return handleResponse(response.data);
  },
  askQuestion: async (
    querySessionId: number,
    query: string
  ): Promise<ChatQueryResponse> => {
    const trimmedQuery = query.length > 1024 ? query.substring(0, 1024) : query;
    
    try {
      const response = await apiClient.post(
        API_ROUTES.CHAT.ASK,
        {
          query_session_id: querySessionId,
          query: trimmedQuery,
        },
        {
          timeout: 120000,
        }
      );
      return handleResponse(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        throw new Error("RATE_LIMIT_REACHED: " + (error.response.data.message || "You have reached your daily chat limit"));
      }
      throw error;
    }
  },

  getRecentChat: async () => {
    const response = await apiClient.get(API_ROUTES.CHAT.SESSION_HISTORY);
    return handleResponse(response.data);
  },

  getTempMessage: async (querySessionId: number): Promise<string | null> => {
    const response = await apiClient.get(
      API_ROUTES.CHAT.GET_TEMP_MESSAGE(querySessionId)
    );
    return handleResponse<string>(response.data);
  },

  getSessionChatHistory: async (
    querySessionId: number
  ): Promise<ChatHistoryMessage[]> => {
    const response = await apiClient.get(
      API_ROUTES.CHAT.CLEAR_HISTORY(querySessionId)
    );
    return handleResponse<ChatHistoryMessage[]>(response.data);
  },

  clearChatHistory: async (querySessionId: number): Promise<void> => {
    const response = await apiClient.delete(
      API_ROUTES.CHAT.CLEAR_HISTORY(querySessionId)
    );
    return handleResponse(response.data);
  },
};
