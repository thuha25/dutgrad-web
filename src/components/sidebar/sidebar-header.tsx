import { BrainCircuit, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { slideInLeft } from "./animations";

interface SidebarHeaderProps {
  hasAnimated: boolean;
  getInitialAnimationState: (forceDisable?: boolean) => "visible" | "hidden";
  isMobile?: boolean;
  onClose: () => void;
  onCollapse?: () => void;
}

export function SidebarHeader({
  hasAnimated,
  getInitialAnimationState,
  isMobile,
  onClose,
  onCollapse,
}: SidebarHeaderProps) {
  return (
    <motion.div
      variants={slideInLeft}
      initial={getInitialAnimationState()}
      animate="visible"
      className="flex h-14 items-center justify-between border-b px-4"
    >
      <div className="flex items-center gap-2">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.4 } },
          }}
          initial={getInitialAnimationState()}
          animate="visible"
        >
          <ThemeToggle />
        </motion.div>
        
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <BrainCircuit className="h-6 w-6 text-primary" />
          </motion.div>
          <motion.div
            initial={hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xl font-bold"
          >
            DUT Grad AI
          </motion.div>
        </Link>
      </div>
      
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.4 } },
        }}
        initial={getInitialAnimationState()}
        animate="visible"
        className="flex items-center gap-2 ml-2"
      >
        {!isMobile && onCollapse && (
          <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon" onClick={onCollapse}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
        {isMobile && (
          <motion.div whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }}>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
