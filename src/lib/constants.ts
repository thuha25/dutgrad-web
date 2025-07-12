export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/oauth/google",
    CALLBACK: "/auth/callback",
    EXCHANGE_STATE: "/auth/exchange-state",
    VERIFY_MFA: "/auth/verify-mfa",
    MFA: {
      STATUS: "/auth/mfa/status",
      SETUP: "/auth/mfa/setup",
      VERIFY: "/auth/mfa/verify",
      VERIFY_EXTERNAL: "/auth/oauth/verify-mfa",
      DISABLE: "/auth/mfa/disable",
    },
  },
  SPACE: {
    ALL: "/spaces",
    CREATE: "/spaces/create",
    PUBLIC: "/spaces/public",
    MINE: "/spaces/me",
    COUNT_MY_SPACE: "/spaces/count/me",
    COUNT_INVITATIONS: "/space-invitations/count",
    COUNT_USER_QUERY_SESSION: "/user-query-sessions/me",
    POPULAR_SPACE: "/spaces/popular?order=user_count",
    ROLES: "/spaces/roles",
    DETAIL: (spaceId: string) => `/spaces/${spaceId}`,
    INVITATIONS: (spaceId: string) => `/spaces/${spaceId}/invitations`,
    MY_INVITATIONS: () => `/invitations/me`,
    DOCUMENTS: (spaceId: string) => `/spaces/${spaceId}/documents`,
    USER_ROLE: (spaceId: string) => `/spaces/${spaceId}/user-role`,
    INVITATION_LINK: (spaceId: string) => `/spaces/${spaceId}/invitation-link`,
    JOIN_SPACE_LINK: (token: string) => `/spaces/join?token=${token}`,
    JOIN_PUBLIC: (spaceId: string) => `/spaces/${spaceId}/join-public`,
    MEMBERS: (spaceId: string) => `/spaces/${spaceId}/members`,
    MEMBERS_COUNT: (spaceId: string) => `/spaces/${spaceId}/members/count`,
    ACCEPT_INVITATION: (invitationId: string) =>
      `/space-invitations/${invitationId}/accept`,
    REJECT_INVITATION: (invitationId: string) =>
      `/space-invitations/${invitationId}/reject`,
    API_KEYS: (spaceId: string) => `/spaces/${spaceId}/api-keys`,
    API_KEY_DETAIL: (spaceId: string, keyId: string) =>
      `/spaces/${spaceId}/api-keys/${keyId}`,
  },
  USER: {
    MINE: "/user/me",
    ME: (userId: string) => `/user/${userId}`,
    SEARCH: "/user/search",
    TIER: "/user/tier",
    PASSWORD: "/user/password",
    AUTH_METHOD: "/user/auth-method",
  },
  DOCUMENT: {
    UPLOAD: "/documents/upload",
    DETAIL: (id: string) => `/documents/${id}`,
    DELETE: (documentId: string) => `/documents/${documentId}`,
    COUNT_MY_DOCUMENTS: "/documents/count/me",
  },
  CHAT: {
    BEGIN_SESSION: "/user-query-sessions/begin-chat-session",
    ASK: "/user-query/ask",
    SESSION_HISTORY: "/user-query-sessions/me",
    GET_TEMP_MESSAGE: (querySessionId: number) =>
      `/user-query-sessions/${querySessionId}/temp-message`,
    CLEAR_HISTORY: (querySessionId: number) =>
      `/user-query-sessions/${querySessionId}/history`,
  },
};

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  AUTH_CALLBACK: "/auth/callback",
  COMPLETE_SETUP: "/complete-setup",
  MY_INVITATIONS: "/invitation/me",
  SPACES: {
    CREATE: "/spaces/create",
    PUBLIC: "/spaces/public",
    MINE: "/spaces/me",
    MEMBER: (spaceId: string) => `/spaces/${spaceId}/members`,
    SETTINGS: (spaceId: string) => `/spaces/${spaceId}/settings`,
    DETAIL: (spaceId: string) => `/spaces/${spaceId}`,
  },
  DOCUMENT: {
    UPLOAD_PROGRESS: (id: string) => `/documents/upload-progress/${id}`,
  },
  CHAT: {
    SPACE: (spaceId: string, sessionId: string) =>
      `/spaces/${spaceId}/chat?sessionId=${sessionId}`,
  },
};

export const ALLOWED_FILE_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",

  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",

  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",

  "text/plain": ".txt",
  "text/csv": ".csv",
};

export const SPACE_ROLE = {
  OWNER: 1,
  EDITOR: 2,
  VIEWER: 3,
};
