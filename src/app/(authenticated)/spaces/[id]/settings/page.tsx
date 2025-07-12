"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpace } from "@/context/space.context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertTriangle,
  Lock,
  Globe,
  Settings2,
  Loader2,
  BotIcon,
  Gauge,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_ROUTES, SPACE_ROLE } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpaceRoleGuard } from "@/components/space/SpaceRoleGuard";

import { GeneralSettings } from "./components/GeneralSettings";
import { ChatApi } from "./components/ChatApi";
import { DangerZone } from "./components/DangerZone";
import { LimitsSettings } from "./components/LimitsSettings";

export default function SpaceSettingsPage() {
  return (
    <SpaceRoleGuard whitelist={[SPACE_ROLE.OWNER]} redirect={true}>
      <SpaceSettingsContent />
    </SpaceRoleGuard>
  );
}

function SpaceSettingsContent() {
  const { space, loading, refetch } = useSpace();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-primary">Loading space...</p>
        </div>
      </motion.div>
    );
  }

  if (!space) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[70vh] text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Space not found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {
            "We couldn't find the space you're looking for. It may have been deleted or you don't have access to it."
          }
        </p>
        <Button
          variant="default"
          onClick={() => router.push(APP_ROUTES.SPACES.MINE)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Go to My Spaces
        </Button>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <AnimatePresence>
      {!isPageLoaded ? (
        <motion.div
          className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
          exit={{ opacity: 0 }}
          key="loading"
        >
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading space settings...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted/30"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          key="content"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="mb-8" variants={itemVariants}>
              <Button
                variant="ghost"
                className="mb-4 pl-0 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                onClick={() =>
                  router.push(APP_ROUTES.SPACES.DETAIL(space.id.toString()))
                }
              >
                <ArrowLeft size={16} />
                Back to Space
              </Button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <motion.h1
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text mb-2"
                    variants={itemVariants}
                  >
                    Space Settings
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground"
                    variants={itemVariants}
                  >
                    Manage your space settings and preferences
                  </motion.p>
                </div>

                <motion.div variants={itemVariants}>
                  <Badge
                    variant={space.privacy_status ? "outline" : "secondary"}
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    {space.privacy_status ? (
                      <>
                        <Lock size={14} />
                        Private Space
                      </>
                    ) : (
                      <>
                        <Globe size={14} />
                        Public Space
                      </>
                    )}
                  </Badge>
                </motion.div>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <Settings2 size={16} />
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="limits"
                    className="flex items-center gap-2"
                  >
                    <Gauge size={16} />
                    Limits
                  </TabsTrigger>
                  <TabsTrigger
                    value="api-keys"
                    className="flex items-center gap-2"
                  >
                    <BotIcon size={16} />
                    Chat API
                  </TabsTrigger>
                  <TabsTrigger
                    value="danger"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    Danger Zone
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <motion.div variants={itemVariants}>
                    <GeneralSettings
                      spaceId={space.id.toString()}
                      initialName={space.name}
                      initialDescription={space.description}
                      initialPrivacyStatus={space.privacy_status}
                      initialSystemPrompt={space.system_prompt}
                      onUpdate={() => {
                        refetch();
                      }}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="limits">
                  <motion.div variants={itemVariants}>
                    <LimitsSettings
                      spaceId={space.id.toString()}
                      initialDocumentLimit={space.document_limit ?? 0}
                      initialFileSizeLimitKb={space.file_size_limit_kb ?? 5120}
                      initialApiCallLimit={space.api_call_limit ?? 0}
                      onUpdate={() => {
                        refetch();
                      }}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="api-keys">
                  <ChatApi spaceId={space.id.toString()} />
                </TabsContent>

                <TabsContent value="danger">
                  <motion.div variants={itemVariants}>
                    <DangerZone
                      spaceId={space.id.toString()}
                      spaceName={space.name}
                    />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
