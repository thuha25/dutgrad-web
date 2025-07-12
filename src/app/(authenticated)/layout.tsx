"use client";

import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@/lib/constants";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { MobileNav } from "@/components/mobile-nav";
import { CollapseToggle } from "@/components/sidebar/collapse-toggle";
import { AnimatePresence } from "framer-motion";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(APP_ROUTES.LOGIN);
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <MobileNav onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isSidebarCollapsed ? (
            <CollapseToggle
              key="collapse-toggle"
              onExpand={() => {
                console.log("Expand button clicked, setting isSidebarCollapsed to false");
                setIsSidebarCollapsed(false);
              }}
            />
          ) : (
            <Sidebar
              key="sidebar"
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onCollapse={() => {
                setIsSidebarCollapsed(true);
              }}
              isCollapsed={false}
            />
          )}
        </AnimatePresence><main className="flex-1 overflow-auto pb-16 md:pb-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
