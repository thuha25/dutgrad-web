"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center text-center"
    >
      <h1 className="text-5xl font-extrabold mb-2">
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Your Dashboard
        </span>
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        {"Welcome back! Here's what's happening in your spaces"}
        <Sparkles className="h-5 w-5 text-amber-500" />
      </p>
    </motion.div>
  );
}
