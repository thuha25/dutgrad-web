"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  isAuthenticated,
  clearAuthTokens,
  setAuthTokens,
  setAuthUser,
  clearAuthUser,
} from "@/lib/auth";
import { APP_ROUTES } from "@/lib/constants";
import { logoutUser } from "./action";
import { User } from "@/schemas/auth";
import Cookies from "js-cookie";
import { TierData, UsageData, userService } from "@/services/api/user.service";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  tier: TierData | null;
  usage: UsageData | null;
  isFetchingTier: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  loginSuccess: (accessToken: string, user: User) => void;
  getAuthUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const [isFetchingTier, setIsFetchingTier] = useState<boolean>(false);
  const [tier, setTier] = useState<TierData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    const checkInitialAuth = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        setUser(getAuthUser());
      }
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    checkInitialAuth();
  }, [pathname]);

  useEffect(() => {
    if (!user) {
      setTier(null);
      setUsage(null);
      return;
    }

    const fetchTierInfo = async () => {
      try {
        setIsFetchingTier(true);
        const response = await userService.getUserTier();
        if (response) {
          setTier(response.tier);
          setUsage(response.usage);
        } else {
          setTier(null);
          setUsage(null);
          console.warn("No tier information was received");
        }
      } catch (err) {
        console.error("Failed to fetch tier info:", err);
        setTier(null);
        setUsage(null);
        console.warn("Error fetching tier information");
      } finally {
        setIsFetchingTier(false);
      }
    };

    fetchTierInfo();
  }, [user]);

  const checkAuth = async () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    return authenticated;
  };

  const loginSuccess = (accessToken: string, user: User) => {
    setAuthTokens({ accessToken });
    setAuthUser(user);
    setUser(user);
    setIsLoggedIn(true);
  };

  const getAuthUser = () => {
    let userStr = null;
    if (typeof window !== "undefined") {
      userStr = Cookies.get("auth-user");
    } else {
      userStr = localStorage.getItem("authUser");
    }

    if (!userStr) {
      return null;
    }

    return JSON.parse(userStr) as User;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearAuthTokens();
      clearAuthUser();
      setUser(null);
      setIsLoggedIn(false);
      router.push(APP_ROUTES.LOGIN);
    }
  };

  const value = {
    isLoggedIn,
    isLoading,
    user,
    setUser,
    tier,
    usage,
    isFetchingTier,
    logout,
    checkAuth,
    loginSuccess,
    getAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
