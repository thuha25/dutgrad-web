"use client";

import { APP_ROUTES } from "@/lib/constants";
import { spaceService } from "@/services/api/space.service";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface Role {
  id: number;
  name: string;
  permission: number;
  created_at: string;
  updated_at: string;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  system_prompt?: string;
  document_limit?: number;
  file_size_limit_kb?: number;
  api_call_limit?: number;
  created_at: string;
  updated_at: string;
}

interface SpaceContextType {
  space: Space | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  refetch: () => void
}

interface Member {
  user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
}

interface Invitation {
  invited_user: {
    username: string;
  };
  space_role: {
    name: string;
  };
  created_at: string;
  status: string;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

function SpaceProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const [users, setUsers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const refetch = () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    spaceService
      .getUserRole(id as string)
      .then((res) => {
        setRole(res.role);
      })
      .catch((err) => {
        setError("Failed to fetch user role");
        console.error(err);
        router.push(APP_ROUTES.SPACES.PUBLIC);
      });

    Promise.all([
      spaceService.getSpaceById(id as string).then((res) => {
        setSpace(res);
      }),
      spaceService.getSpaceMembers(id as string).then((res) => {
        setUsers(res.members);
      }),
      spaceService.getSpaceInvitations(id as string).then((res) => {
        setInvitations(res.invitations);
      }),
    ])
      .catch((err) => {
        setError("Failed to fetch space details");
        router.push(APP_ROUTES.SPACES.PUBLIC);
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const router = useRouter();
  useEffect(() => {
    refetch()
  }, [id]);

  return (
    <SpaceContext.Provider value={{ space, role, loading, error, refetch }}>
      {children}
    </SpaceContext.Provider>
  );
}

export const useSpace = () => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context;
};

export default SpaceProvider;
