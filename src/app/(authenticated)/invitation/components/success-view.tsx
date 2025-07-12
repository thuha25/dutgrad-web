"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function SuccessView() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-green-200 dark:border-green-900"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4"
      >
        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-500 text-transparent bg-clip-text"
      >
        Successfully joined!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4 text-gray-600 dark:text-gray-300"
      >
        You will be redirected to your spaces...
      </motion.p>
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"
      />
    </motion.div>
  );
}
