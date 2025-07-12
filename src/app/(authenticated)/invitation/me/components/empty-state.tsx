"use client";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-1">No invitations</h3>
        <p className="text-muted-foreground">
          {"You don't have any pending space invitations at the moment."}
        </p>
      </CardContent>
    </Card>
  );
}
