import type React from "react";
import { cn } from "@/lib/utils";

interface ScrollableTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ScrollableTable({
  children,
  className,
  ...props
}: ScrollableTableProps) {
  return (
    <div
      className={cn("w-full overflow-auto max-w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
