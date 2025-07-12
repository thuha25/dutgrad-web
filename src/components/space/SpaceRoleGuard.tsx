"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { spaceService } from "@/services/api/space.service";
import { APP_ROUTES } from "@/lib/constants";

interface SpaceRoleGuardProps {
  whitelist: number[];
  children: React.ReactNode;
  redirect?: boolean;
}

export function SpaceRoleGuard({ whitelist, children, redirect = false }: SpaceRoleGuardProps) {
  const [role, setRole] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const spaceId = params?.id as string;

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        const response = await spaceService.getUserRole(spaceId);
        setRole(response.role);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchUserRole();
    }
  }, [spaceId]);

  if (loading) {
    return null;
  }

  if (!role) {
    return null;
  }
  const hasPermission = whitelist.includes(role.id);

  if (!hasPermission) {
    if (redirect && spaceId) {
      router.push(APP_ROUTES.SPACES.DETAIL(spaceId));
      return null;
    }
    return null;
  }

  return <>{children}</>;
}
