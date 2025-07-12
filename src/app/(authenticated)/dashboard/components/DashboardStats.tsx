"use client";

import React from "react";
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { StatsCard } from "../components/StatsCard";

interface StatsProps {
  spaceCount: number | null;
  chatSessionCount: number | null;
  popularSpacesCount: number;
  loading: boolean;
  isDataReady: boolean;
  containerVariants: any;
  itemVariants: any;
}

export function DashboardStats({
  spaceCount,
  chatSessionCount,
  popularSpacesCount,
  loading,
  isDataReady,
  containerVariants,
  itemVariants,
}: StatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
      {!isDataReady ? (
        <>
          <StatsCard
            title="My Spaces"
            value={spaceCount}
            description="Total spaces you've created or joined"
            icon={<Users className="h-6 w-6 text-white" />}
            loading={loading}
            color="from-violet-500 to-purple-600"
            accentColor="rgba(139, 92, 246, 0.3)"
            animate={false}
          />
          <StatsCard
            title="Chat Sessions"
            value={chatSessionCount}
            description="Total chat sessions you've participated in"
            icon={<MessageSquare className="h-6 w-6 text-white" />}
            loading={loading}
            color="from-cyan-500 to-blue-600"
            accentColor="rgba(14, 165, 233, 0.3)"
            animate={false}
          />
          <StatsCard
            title="Popular Spaces"
            value={popularSpacesCount}
            description="Number of trending spaces"
            icon={<TrendingUp className="h-6 w-6 text-white" />}
            loading={loading}
            color="from-pink-500 to-rose-600"
            accentColor="rgba(244, 114, 182, 0.3)"
            animate={false}
          />
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full"
            style={{ gridColumn: "1 / -1" }}
          >
            <motion.div variants={itemVariants}>
              <StatsCard
                title="My Spaces"
                value={spaceCount}
                description="Total spaces you've created or joined"
                icon={<Users className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-violet-500 to-purple-600"
                accentColor="rgba(139, 92, 246, 0.3)"
                animate={true}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatsCard
                title="Chat Sessions"
                value={chatSessionCount}
                description="Total chat sessions you've participated in"
                icon={<MessageSquare className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-cyan-500 to-blue-600"
                accentColor="rgba(14, 165, 233, 0.3)"
                animate={true}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatsCard
                title="Popular Spaces"
                value={popularSpacesCount}
                description="Number of trending spaces"
                icon={<TrendingUp className="h-6 w-6 text-white" />}
                loading={loading}
                color="from-pink-500 to-rose-600"
                accentColor="rgba(244, 114, 182, 0.3)"
                animate={true}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
