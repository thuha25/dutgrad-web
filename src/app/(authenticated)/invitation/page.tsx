"use client";
import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { toast, Toaster } from "sonner";
import { APP_ROUTES } from "@/lib/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { 
  SuccessView, 
  InvitationView, 
  BackgroundAnimation 
} from "./components";

export default function InvitationPage() {
  const [loading, setLoading] = useState(true);
  const [canJoin, setCanJoin] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleJoin = async () => {
    if (!token) {
      toast.error("Token not found in URL.");
      return;
    }

    setLoading(true);
    try {
      await spaceService.joinSpaceWithToken(token);
      setSuccess(true);
      setTimeout(() => {
        router.push(APP_ROUTES.SPACES.MINE);
      }, 1500);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message;
      if (errMsg) {
        toast.error(errMsg);
      } else {
        toast.error("Failed to join space");
      }
      setCanJoin(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      return;
    }

    handleJoin();
  }, [token]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />

      <AnimatePresence mode="wait">
        {success ? (
          <SuccessView />
        ) : (
          <InvitationView 
            loading={loading} 
            canJoin={canJoin} 
            onJoin={handleJoin}
          />
        )}
      </AnimatePresence>

      <BackgroundAnimation />
    </div>
  );
}
