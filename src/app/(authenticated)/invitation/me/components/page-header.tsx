"use client";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function PageHeader({ loading, onRefresh }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10">
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          My Invitations
        </span>
      </h1>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="gap-1"
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
