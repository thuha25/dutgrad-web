import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SidebarNavProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { slideInUp } from "./animations";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function SidebarNav({
  items,
  className,
  hasAnimated = false,
  ...props
}: SidebarNavProps & { hasAnimated?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};

    items.forEach((item) => {
      if (item.subItems) {
        const shouldBeOpen = item.subItems.some((subItem) =>
          pathname.startsWith(subItem.href)
        );
        if (shouldBeOpen) {
          initialState[item.title] = true;
        }
      }
    });

    return initialState;
  });

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const getInitialAnimationState = () => {
    if (shouldReduceMotion || hasAnimated) return "visible";
    return "hidden";
  };

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item, idx) => (
        <motion.div
          key={item.title}
          variants={slideInUp}
          initial={getInitialAnimationState()}
          animate="visible"
          custom={idx}
        >
          {item.href ? (
            <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.97 }}>
              <div
                onClick={() => item.href && router.push(item.href)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                {item.icon}
                {item.title}
                {item.badge && (
                  <motion.div
                    initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.3 + idx * 0.1,
                    }}
                  >
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <div>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleMenu(item.title)}
                className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              >
                <motion.span
                  animate={
                    openMenus[item.title]
                      ? { rotate: [0, 10, -10, 0] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.span>
                {item.title}
                {item.badge && (
                  <motion.div
                    initial={hasAnimated ? { scale: 1 } : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <Badge variant="secondary" className="ml-auto mr-2 text-xs">
                      {item.badge}
                    </Badge>
                  </motion.div>
                )}
                <motion.span
                  animate={{ rotate: openMenus[item.title] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("ml-auto", item.badge && "ml-2")}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {openMenus[item.title] && item.subItems && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="ml-6 mt-1 flex flex-col gap-1 overflow-hidden"
                  >
                    {item.subItems.map((subItem, subIdx) => (
                      <motion.div
                        key={subItem.href}
                        variants={slideInUp}
                        custom={subIdx}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ delay: 0.1 * subIdx }}
                      >
                        <div
                          onClick={() => router.push(subItem.href)}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted cursor-pointer",
                            pathname === subItem.href
                              ? "bg-muted text-primary"
                              : "transparent"
                          )}
                        >
                          <motion.span
                            animate={
                              pathname === subItem.href
                                ? { scale: [1, 1.2, 1] }
                                : { scale: 1 }
                            }
                            transition={{
                              duration: 0.5,
                              repeat: pathname === subItem.href ? 1 : 0,
                            }}
                          >
                            {subItem.icon}
                          </motion.span>
                          {subItem.title}
                          {subItem.badge && (
                            <motion.div
                              initial={
                                hasAnimated ? { scale: 1 } : { scale: 0 }
                              }
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 15,
                                delay: 0.2 + subIdx * 0.1,
                              }}
                            >
                              <Badge
                                variant="secondary"
                                className="ml-auto text-xs"
                              >
                                {subItem.badge}
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      ))}
    </nav>
  );
}
