"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/api/user.service";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/auth.context";
import { mfaService } from "@/services/api/mfa.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ProfileCard } from "./components/ProfileCard";
import { AccountDetailsCard } from "./components/AccountDetailsCard";
import { MFAStatusCard } from "./components/MFAStatusCard";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mfaStatus, setMfaStatus] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUser(data);

        const mfaStatusData = await mfaService.getMFAStatus();
        setMfaStatus(mfaStatusData.mfa_enabled);
      } catch (error) {
        console.error("Failed to fetch user profile or MFA status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 text-center"
      >
        Unable to load user data.
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Your Profile
      </motion.h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="profile" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <ProfileCard user={user} setUser={setUser} />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <AccountDetailsCard user={user} mfaStatus={mfaStatus} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                <MFAStatusCard
                  mfaStatus={mfaStatus}
                  setMfaStatus={setMfaStatus}
                  user={user}
                  setUser={setUser}
                />
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
