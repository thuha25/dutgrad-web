"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CollapseToggleProps {
  onExpand: () => void;
}

export function CollapseToggle({ onExpand }: CollapseToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="fixed top-4 left-4 z-50"
    >
      <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            console.log("Expand button clicked");
            onExpand();
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
