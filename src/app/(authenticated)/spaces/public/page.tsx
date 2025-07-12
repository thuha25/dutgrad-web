"use client";
import React, { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import SpaceCard from "../components/SpaceCard";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PublicSpace {
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
}

export default function PublicSpacesPage() {
  const [publicSpaces, setPublicSpaces] = useState<PublicSpace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [joinedSpaceIds, setJoinedSpaceIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicSpaces = async () => {
      try {
        const [publicRes, joinedRes] = await Promise.all([
          spaceService.getSpacePublic(),
          spaceService.getYourSpaces(),
        ]);
        const joinSpaces = joinedRes.spaces || [];
        const publicSpaces = publicRes.public_spaces || [];

        setPublicSpaces(publicSpaces);
        setJoinedSpaceIds(joinSpaces.map((space: any) => space.id));
      } catch (err) {
        setError("Failed to fetch public spaces");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicSpaces();
  }, []);

  const handleJoinSpace = async (spaceId: number) => {
    try {
      await spaceService.joinSpace(spaceId.toString());
      toast.success("Successfully joined the space!");
      setJoinedSpaceIds((prevJoinedSpaceIds) => [
        ...prevJoinedSpaceIds,
        spaceId,
      ]);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.info("You are already a member of this space.");
      } else if (error.response?.status === 403) {
        toast.error("This space is private and cannot be joined.");
      } else {
        toast.error("Failed to join the space.");
      }
    }
  };

  const filteredSpaces = searchTerm
    ? publicSpaces.filter(
        (space) =>
          space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          space.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : publicSpaces;

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
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
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 3, ease: "linear" },
                scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
              }}
            >
              <Globe className="h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
              Discovering public spaces...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <motion.h1
        className="text-5xl font-extrabold text-center mb-4"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Public Spaces
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-center flex flex-col items-center mb-10"
      >
        <p className="text-center text-primary text-lg mb-4 flex items-center gap-2">
          Explore a collection of amazing public spaces
          <motion.span
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Globe className="h-5 w-5 text-blue-500" />
          </motion.span>
        </p>

        <motion.div
          className="w-full max-w-md relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Input
            type="text"
            placeholder="Search for spaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md pl-10 border-2 border-primary/20 focus:border-primary/50 transition-all rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          {searchTerm && (
            <motion.span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs rounded-full bg-primary/20 py-1 px-2 text-primary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {filteredSpaces.length} results
            </motion.span>
          )}
        </motion.div>
      </motion.div>

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
      ) : filteredSpaces.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [20, 0] }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-xl p-8 backdrop-blur-sm"
        >
          {searchTerm ? (
            <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
              🔍 No spaces found matching &quot;{searchTerm}&quot;
            </p>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <Sparkles className="h-12 w-12 text-gray-400" />
              </motion.div>
              <p className="text-center text-gray-600 dark:text-gray-300 text-lg">
                🚫 There are no public spaces available yet.
              </p>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredSpaces.map((space: PublicSpace) => (
              <motion.div
                key={space.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <SpaceCard
                  key={space.id}
                  space={space}
                  enableJoin={true}
                  onJoin={handleJoinSpace}
                  isMember={joinedSpaceIds.includes(space.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
