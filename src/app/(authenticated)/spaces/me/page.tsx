"use client";
import React, { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { useRouter } from "next/navigation";
import SpaceCard from "../components/SpaceCard";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Sparkles, Crown, UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { SPACE_ROLE } from "@/lib/constants";

interface YourSpace {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  document_limit?: number;
  file_size_limit_kb?: number;
  api_call_limit?: number;
  created_at: string;
  updated_at: string;
  user_count?: number;
  role: {
    id: number;
    name: string;
    permission: number;
  };
}

export default function YourSpacesPage() {
  const [yourSpaces, setYourSpaces] = useState<YourSpace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchYourSpaces = async () => {
      try {
        const response = await spaceService.getYourSpaces();
        const spaces = response.spaces || [];

        setYourSpaces(spaces);
      } catch (err) {
        setError("Failed to fetch your spaces");
      } finally {
        setLoading(false);
      }
    };

    fetchYourSpaces();
  }, []);

  const filterSpaces = (spaces: YourSpace[], tab: string, query: string) => {
    let filteredSpaces = spaces;
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      filteredSpaces = spaces.filter(
        (space) =>
          space.name.toLowerCase().includes(lowerQuery) ||
          (space.description &&
            space.description.toLowerCase().includes(lowerQuery))
      );
    }
    if (tab === "owned") {
      return filteredSpaces.filter((space) => space.role?.id === SPACE_ROLE.OWNER);
    } else if (tab === "joined") {
      return filteredSpaces.filter((space) => space.role?.id !== SPACE_ROLE.OWNER);
    }
    return filteredSpaces;
  };

  const filteredSpaces = filterSpaces(yourSpaces, activeTab, searchQuery);

  const containerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: shouldReduceMotion ? 50 : 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: shouldReduceMotion ? { opacity: 0.9 } : { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.7,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.div
              animate={
                shouldReduceMotion
                  ? { rotate: 0 }
                  : {
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }
              }
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }}
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
              Loading your spaces...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <motion.h1
        className="text-5xl font-extrabold text-center mb-6"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Your Spaces
        </span>
      </motion.h1>

      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md max-w-md mx-auto"
        >
          <p className="text-center text-red-600">{error}</p>
          <div className="flex justify-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      ) : yourSpaces.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [20, 0] }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-xl p-8 backdrop-blur-sm"
        >
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg mb-6">
            {"🚫 You haven't joined or created any spaces yet."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-6 py-2 rounded-md shadow-md transition-all"
            onClick={() => router.push("/spaces/create")}
          >
            Create Your First Space
          </motion.button>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search spaces by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              {searchQuery && (
                <motion.span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs rounded-full bg-primary/20 py-1 px-2 text-primary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {filteredSpaces.length} results
                </motion.span>
              )}
            </div>
            <Button
              onClick={() => router.push("/spaces/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Space
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="all">All Spaces</TabsTrigger>
              <TabsTrigger value="owned" className="flex items-center gap-1">
                <Crown className="h-4 w-4" /> Owned
              </TabsTrigger>
              <TabsTrigger value="joined" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> Joined
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {filteredSpaces.length === 0 ? (
                <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm">
                  <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
                    🔍 No spaces found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filteredSpaces.map((space: YourSpace) => (
                      <motion.div
                        key={space.id}
                        variants={itemVariants}
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : { y: -5, transition: { duration: 0.2 } }
                        }
                        layout
                      >
                        <SpaceCard key={space.id} space={space} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="owned" className="mt-6">
              {filterSpaces(yourSpaces, "owned", searchQuery).length === 0 ? (
                <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery
                      ? "No owned spaces matching your search"
                      : "You don't own any spaces yet"}
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filterSpaces(yourSpaces, "owned", searchQuery).map(
                      (space: YourSpace) => (
                        <motion.div
                          key={space.id}
                          variants={itemVariants}
                          whileHover={
                            shouldReduceMotion
                              ? {}
                              : { y: -5, transition: { duration: 0.2 } }
                          }
                          layout
                        >
                          <SpaceCard key={space.id} space={space} />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="joined" className="mt-6">
              {filterSpaces(yourSpaces, "joined", searchQuery).length === 0 ? (
                <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    {searchQuery
                      ? "No joined spaces matching your search"
                      : "You haven't joined any spaces yet"}
                  </p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filterSpaces(yourSpaces, "joined", searchQuery).map(
                      (space: YourSpace) => (
                        <motion.div
                          key={space.id}
                          variants={itemVariants}
                          whileHover={
                            shouldReduceMotion
                              ? {}
                              : { y: -5, transition: { duration: 0.2 } }
                          }
                          layout
                        >
                          <SpaceCard key={space.id} space={space} />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
