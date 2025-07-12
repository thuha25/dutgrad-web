"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/auth.context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  LayoutDashboard,
  User,
  MessageSquare,
  Users,
  Sparkles,
  Plus,
  BrainCircuit,
} from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { spaceService } from "@/services/api/space.service";
import { UserTierInfo } from "./user/UserTierInfo";
import { SidebarHeader } from "./sidebar/sidebar-header";
import { UserProfile } from "./sidebar/user-profile";
import { RecentChats } from "./sidebar/recent-chats";
import { SidebarNav } from "./sidebar/sidebar-nav";
import {
  fadeIn,
  slideInLeft,
  staggerContainer,
  animationState,
} from "./sidebar/animations";

interface SidebarProps {
  isMobile?: boolean;
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose: () => void;
  onCollapse?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onCollapse,
  isMobile,
  isCollapsed: externalCollapsed,
}: SidebarProps) {
  const { logout, getAuthUser } = useAuth();
  const [invitationCount, setInvitationCount] = useState<number>(0);
  const user = getAuthUser();
  const shouldReduceMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(animationState.hasAnimated);

  const isCollapsed = externalCollapsed || false;

  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      animationState.hasAnimated = true;
    }
  }, [hasAnimated]);

  useEffect(() => {
    if (user) {
      const fetchInvitationCount = async () => {
        try {
          const count = await spaceService.getInvitationCount();
          setInvitationCount(count);
        } catch (error) {
          console.error("Failed to fetch invitation count:", error);
        }
      };

      fetchInvitationCount();
    }
  }, [user]);

  isMobile =
    isMobile || typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const getInitialAnimationState = (forceDisable = false) => {
    if (shouldReduceMotion || hasAnimated || forceDisable) return "visible";
    return "hidden";
  };

  const sidebarNavItems = [
    {
      title: "Dashboard",
      href: APP_ROUTES.DASHBOARD,
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "AI Spaces",
      icon: <BrainCircuit className="mr-2 h-4 w-4" />,
      badge: "New",
      subItems: [
        {
          title: "Create AI Space",
          href: APP_ROUTES.SPACES.CREATE,
          icon: <Plus className="mr-2 h-4 w-4" />,
        },
        {
          title: "Discover Spaces",
          href: APP_ROUTES.SPACES.PUBLIC,
          icon: <Sparkles className="mr-2 h-4 w-4" />,
        },
        {
          title: "My AI Spaces",
          href: APP_ROUTES.SPACES.MINE,
          icon: <MessageSquare className="mr-2 h-4 w-4" />,
        },
        {
          title: "Invitations",
          href: APP_ROUTES.MY_INVITATIONS,
          icon: <Users className="mr-2 h-4 w-4" />,
          badge: invitationCount > 0 ? invitationCount.toString() : undefined,
        },
      ],
    },
    {
      title: "Profile",
      href: APP_ROUTES.PROFILE,
      icon: <User className="mr-2 h-4 w-4" />,
    },
  ];
  const handleCollapse = () => {
    if (onCollapse) {
      onCollapse();
    }
  };

  const SidebarContent = () => (
    <motion.div
      initial={getInitialAnimationState()}
      animate="visible"
      variants={fadeIn}
      className="flex flex-col h-full bg-background"
    >
      <SidebarHeader
        hasAnimated={hasAnimated}
        getInitialAnimationState={getInitialAnimationState}
        isMobile={isMobile}
        onClose={onClose}
        onCollapse={handleCollapse}
      />

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.2 }}
        className="p-4 border-b"
      >
        <UserProfile hasAnimated={hasAnimated} />
      </motion.div>

      <RecentChats
        hasAnimated={hasAnimated}
        getInitialAnimationState={getInitialAnimationState}
      />

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.4 }}
        className="flex-1 overflow-y-auto"
      >
        <ScrollArea className="h-full">
          <motion.div
            variants={staggerContainer}
            initial={getInitialAnimationState()}
            animate="visible"
            className="flex flex-col gap-1 p-2"
          >
            <SidebarNav items={sidebarNavItems} hasAnimated={hasAnimated} />
          </motion.div>
        </ScrollArea>
      </motion.div>

      <motion.div
        variants={slideInLeft}
        initial={getInitialAnimationState()}
        animate="visible"
        transition={{ delay: 0.5 }}
        className="border-t p-4"
      >
        <UserTierInfo />
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="destructive"
            className="w-full flex items-center justify-center"
            onClick={() => logout()}
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.3 }}
            >
              <LogOut className="mr-2 h-4 w-4" />
            </motion.div>
            Log out
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }
  if (isCollapsed) {
    return null;
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -320, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="hidden md:block w-68 border-r h-screen overflow-hidden"
    >
      <SidebarContent />
    </motion.aside>
  );
}
