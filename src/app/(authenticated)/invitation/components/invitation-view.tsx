"use client";
import { motion } from "framer-motion";
import { Loader, Sparkles, Rocket } from "lucide-react";
import { containerVariants, itemVariants, buttonVariants, pulseAnimation } from "./animation-variants";

interface InvitationViewProps {
  loading: boolean;
  canJoin: boolean;
  onJoin: () => Promise<void>;
}

export function InvitationView({ loading, canJoin, onJoin }: InvitationViewProps) {
  return (
    <motion.div
      key="invitation"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-indigo-100 dark:border-indigo-900"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative mx-auto"
      >
        <motion.div
          animate={pulseAnimation}
          className="absolute inset-0 bg-indigo-300/50 dark:bg-indigo-600/30 rounded-full blur-xl"
        />
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 1 }}
          className="relative bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
        >
          <Rocket className="h-8 w-8 text-white" />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-yellow-300" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text"
      >
        {"You've been invited to join a space"}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="mb-6 text-gray-600 dark:text-gray-300"
      >
        Click the button below to accept the invitation.
      </motion.p>

      {canJoin && (
        <motion.div variants={itemVariants}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onJoin}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all w-full flex items-center justify-center"
          >
            {loading ? (
              <Loader className="animate-spin mr-2 w-5 h-5" />
            ) : (
              <>
                <Rocket className="mr-2 h-5 w-5" />
                Join Space
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {!canJoin && loading && <LoadingIndicator />}
    </motion.div>
  );
}

function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center"
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
          scale: { repeat: Infinity, duration: 1, ease: "easeInOut" },
        }}
      >
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent" />
      </motion.div>
      <motion.p
        className="text-gray-500 text-sm mt-4"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Processing invitation...
      </motion.p>
    </motion.div>
  );
}
