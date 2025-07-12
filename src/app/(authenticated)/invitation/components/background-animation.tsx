"use client";
import { motion } from "framer-motion";

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 bg-gradient-to-br from-purple-300/10 to-indigo-300/10 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
            y: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
