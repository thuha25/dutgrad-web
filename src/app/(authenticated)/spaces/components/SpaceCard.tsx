"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Unlock, Users, Calendar, Star } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";

interface Space {
  id: number;
  name: string;
  description: string;
  privacy_status: boolean;
  document_limit?: number;
  file_size_limit_kb?: number;
  api_call_limit?: number;
  created_at: string;
  updated_at: string;
  user_count?: number;
}

interface SpaceCardProps {
  space: Space;
  enableJoin?: boolean;
  onJoin?: (spaceId: number) => void;
  isMember?: boolean;
}

export default function SpaceCard({
  space,
  enableJoin,
  onJoin,
  isMember,
}: SpaceCardProps) {
  const router = useRouter();
  const handleCardClick = (spaceId: number) => {
    if (!enableJoin) {
      router.push(APP_ROUTES.SPACES.DETAIL(spaceId.toString()));
    }
  };
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [spaceToJoin, setSpaceToJoin] = useState<number | null>(null);

  const handleJoin = (e: React.MouseEvent, spaceId: number) => {
    e.stopPropagation();
    setSpaceToJoin(spaceId);
    setShowJoinDialog(true);
  };

  const handleJoinOnly = () => {
    if (spaceToJoin) {
      onJoin?.(spaceToJoin);
      setShowJoinDialog(false);
    }
  };

  const handleJoinAndGo = () => {
    if (spaceToJoin) {
      onJoin?.(spaceToJoin);
      router.push(APP_ROUTES.SPACES.DETAIL(spaceToJoin.toString()));
    }
  };

  const pastels = [
    "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/70",
    "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/70",
    "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/70",
    "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/70",
    "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/70",
  ];

  const accentColors = [
    "text-blue-600 dark:text-blue-400",
    "text-emerald-600 dark:text-emerald-400",
    "text-amber-600 dark:text-amber-400",
    "text-purple-600 dark:text-purple-400",
    "text-rose-600 dark:text-rose-400",
  ];

  const buttonColors = [
    "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
    "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800",
    "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800",
    "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800",
    "bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800",
  ];

  const colorIndex = space.id % pastels.length;
  const themeColor = pastels[colorIndex];
  const accentColor = accentColors[colorIndex];
  const buttonColor = buttonColors[colorIndex];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="w-full"
    >
      <Card
        key={space.id}
        onClick={() => handleCardClick(space.id)}
        className={`cursor-pointer h-full overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 ${
          enableJoin ? "hover:border-gray-300 dark:hover:border-gray-700" : ""
        }`}
      >
        <div className={`h-2 ${themeColor}`} />

        <CardHeader className="pt-5 pb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-md ${themeColor} ${accentColor} font-medium text-sm`}
              >
                {space.name.substring(0, 2).toUpperCase()}
              </div>
              <CardTitle className="text-lg font-semibold group-hover:underline transition-all">
                {space.name}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
            Created{" "}
            {new Date(space.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-3">
          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
            {space.description || "No description available for this space."}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {space.user_count !== undefined ? space.user_count : "-"}{" "}
                members
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>
                Created{" "}
                {new Date(space.created_at)
                  .toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  .replace(/\//g, "-")}
              </span>
            </div>
            {space.user_count && space.user_count >= 3 && (
              <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                <Star className="h-3.5 w-3.5 mr-1.5 fill-amber-500 dark:fill-amber-400" />
                <span>Popular</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-3 mt-auto border-t border-gray-100 dark:border-gray-800">
          <Badge
            variant={space.privacy_status ? "secondary" : "outline"}
            className={`px-2 py-0.5 text-xs flex items-center gap-1 ${
              !space.privacy_status
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
            }`}
          >
            {space.privacy_status ? (
              <>
                <Lock className="h-3 w-3" /> Private
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3" /> Public
              </>
            )}
          </Badge>

          {enableJoin && !isMember ? (
            <Button
              size="sm"
              onClick={(e) => handleJoin(e, space.id)}
              className={`${buttonColor} text-white shadow-sm hover:shadow-md transition-all`}
            >
              Join Space
            </Button>
          ) : isMember ? (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Member
            </Badge>
          ) : null}
        </CardFooter>
      </Card>
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Space</DialogTitle>
            <DialogDescription>
              You can join this space and navigate to it, or just join it and
              stay on the current page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
            <Button variant="outline" onClick={handleJoinOnly}>
              Just Join
            </Button>
            <Button onClick={handleJoinAndGo} className={buttonColor}>
              Join and Go to Space
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
