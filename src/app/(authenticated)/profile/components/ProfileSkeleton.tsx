"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Skeleton className="h-10 w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 col-span-1" />
        <Skeleton className="h-64 col-span-1 md:col-span-2" />
      </div>
    </div>
  );
}
