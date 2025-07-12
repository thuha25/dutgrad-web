"use client";

import { Home, MessageSquare, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/lib/constants";

interface MobileNavProps {
  onOpenSidebar: () => void;
}

export function MobileNav({ onOpenSidebar }: MobileNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: APP_ROUTES.DASHBOARD,
      icon: Home,
    },
    {
      label: "Spaces",
      href: APP_ROUTES.SPACES.PUBLIC,
      icon: MessageSquare,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Search,
    },
    {
      label: "Profile",
      href: APP_ROUTES.PROFILE,
      icon: User,
    },
  ];

  return (
    <>
      <header className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-40 bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
          <span className="font-bold text-xl">DUT Grad AI</span>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-2 py-1 w-full h-full text-xs",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
