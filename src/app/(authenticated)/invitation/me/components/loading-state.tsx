"use client";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardFooter className="flex justify-end pt-2">
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
