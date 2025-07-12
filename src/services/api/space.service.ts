import { apiClient } from "@/lib/axios";
import { handleResponse } from "./helper";
import { API_ROUTES } from "@/lib/constants";

export const spaceService = {
  createSpace: async (data: {
    name: string;
    description: string;
    privacy_status: boolean;
  }) => {
    try {
      const response = await apiClient.post(API_ROUTES.SPACE.ALL, data);
      return handleResponse(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        throw error;
      }
      throw error;
    }
  },
  updateSpace: async (
    spaceId: string,
    data: {
      name?: string;
      description?: string;
      privacy_status?: boolean;
      system_prompt?: string;
      document_limit?: number;
      file_size_limit_kb?: number;
      api_call_limit?: number;
    }
  ) => {
    const response = await apiClient.patch(
      API_ROUTES.SPACE.DETAIL(spaceId),
      data
    );
    return handleResponse(response.data);
  },
  deleteSpace: async (spaceId: string) => {
    const response = await apiClient.delete(API_ROUTES.SPACE.DETAIL(spaceId));
    return handleResponse(response.data);
  },
  getSpacePublic: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.PUBLIC);
    return handleResponse(response.data);
  },
  getYourSpaces: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.MINE);
    return handleResponse(response.data);
  },
  getSpaceById: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.DETAIL(spaceId));
    return handleResponse(response.data);
  },
  getDocumentBySpace: async (
    spaceId: string,
    page: number = 1,
    pageSize: number = 20
  ) => {
    const response = await apiClient.get(API_ROUTES.SPACE.DOCUMENTS(spaceId), {
      params: { page, pageSize },
    });
    return handleResponse(response.data);
  },
  getSpaceMembers: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.MEMBERS(spaceId));
    return handleResponse(response.data);
  },
  getSpaceInvitations: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.INVITATIONS(spaceId));
    return handleResponse(response.data);
  },
  getSpaceRoles: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.ROLES);
    return handleResponse(response.data);
  },
  getUserRole: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.USER_ROLE(spaceId));
    return handleResponse(response.data);
  },
  getMyInvitations: async () => {
    const response = await apiClient.get(
      `${API_ROUTES.SPACE.MY_INVITATIONS()}`
    );
    return handleResponse(response.data);
  },
  inviteUser: async (spaceId: string, userId: number, roleId: number, message?: string) => {
    const response = await apiClient.post(
      `${API_ROUTES.SPACE.INVITATIONS(spaceId)}`,
      { invited_user_id: userId, space_role_id: roleId, message }
    );
    return handleResponse(response.data);
  },
  getOrCreateInviteLink: async (spaceId: string, spaceRoleId: number) => {
    const response = await apiClient.put(
      `${API_ROUTES.SPACE.INVITATION_LINK(spaceId)}`,
      {
        space_role_id: spaceRoleId,
      }
    );
    return handleResponse(response.data);
  },
  joinSpaceWithToken: async (token: string) => {
    const response = await apiClient.post(
      `${API_ROUTES.SPACE.JOIN_SPACE_LINK(token)}`
    );
    return handleResponse(response.data);
  },
  acceptInvitation: async (invitationId: string) => {
    const response = await apiClient.put(
      `${API_ROUTES.SPACE.ACCEPT_INVITATION(invitationId)}`
    );
    return handleResponse(response.data);
  },
  rejectInvitation: async (invitationId: string) => {
    const response = await apiClient.put(
      `${API_ROUTES.SPACE.REJECT_INVITATION(invitationId)}`
    );
    return handleResponse(response.data);
  },
  joinSpace: async (spaceId: string) => {
    const response = await apiClient.post(
      API_ROUTES.SPACE.JOIN_PUBLIC(spaceId)
    );
    return handleResponse(response.data);
  },
  getPopularSpaces: async () => {
    const response = await apiClient.get(API_ROUTES.SPACE.POPULAR_SPACE);
    return handleResponse(response.data);
  },
  getCountMySpace: async () => {
    const response = await apiClient.head(API_ROUTES.SPACE.COUNT_MY_SPACE);
    const count = response.headers["x-space-count"];
    return Number(count);
  },
  getInvitationCount: async (): Promise<number> => {
    const response = await apiClient.get(API_ROUTES.SPACE.COUNT_INVITATIONS);
    return handleResponse(response.data).count || 0;
  },
  getCountMyChatSessions: async (): Promise<number> => {
    const response = await apiClient.head(
      API_ROUTES.SPACE.COUNT_USER_QUERY_SESSION
    );
    return Number(response.headers["x-total-count"]);
  },
  getSpaceMembersCount: async (spaceId: string): Promise<number> => {
    const response = await apiClient.get(API_ROUTES.SPACE.MEMBERS_COUNT(spaceId));
    return handleResponse(response.data).count || 0;
  },
  updateUserRole: async (spaceId: string, memberId: string, roleId: number) => {
    const response = await apiClient.patch(
      `${API_ROUTES.SPACE.DETAIL(spaceId)}/members/${memberId}/role`,
      { role_id: roleId }
    );
    return handleResponse(response.data);
  },
  removeMember: async (spaceId: string, memberId: string) => {
    const response = await apiClient.delete(
      `${API_ROUTES.SPACE.DETAIL(spaceId)}/members/${memberId}`
    );
    return handleResponse(response.data);
  },
  createApiKey: async (
    spaceId: string,
    data: { name: string; description: string }
  ) => {
    const response = await apiClient.post(
      API_ROUTES.SPACE.API_KEYS(spaceId),
      data
    );
    return handleResponse(response.data);
  },
  getApiKeys: async (spaceId: string) => {
    const response = await apiClient.get(API_ROUTES.SPACE.API_KEYS(spaceId));
    return handleResponse(response.data);
  },
  getApiKey: async (spaceId: string, keyId: string) => {
    const response = await apiClient.get(
      API_ROUTES.SPACE.API_KEY_DETAIL(spaceId, keyId)
    );
    return handleResponse(response.data);
  },
  deleteApiKey: async (spaceId: string, keyId: string) => {
    const response = await apiClient.delete(
      API_ROUTES.SPACE.API_KEY_DETAIL(spaceId, keyId)
    );
    return handleResponse(response.data);
  },
};
