"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Users } from "lucide-react";
import SpaceCard from "../../spaces/components/SpaceCard";

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

interface PopularSpacesProps {
  spaces: Space[];
  joinedSpaceIds: number[];
  loading: boolean;
  isDataReady: boolean;
  onJoin: (spaceId: number) => Promise<void>;
  containerVariants: any;
  itemVariants: any;
}

export function PopularSpaces({
  spaces,
  joinedSpaceIds,
  loading,
  isDataReady,
  onJoin,
  containerVariants,
  itemVariants,
}: PopularSpacesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-fuchsia-600" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Popular Spaces
          </h2>
        </div>
        <Badge className="bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300">
          Trending Now
        </Badge>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Card className="overflow-hidden border-t-4 border-t-indigo-400">
                      <CardContent className="p-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                        <Skeleton className="h-16 w-full mt-4" />
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-8 w-1/4 rounded-md" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
            ) : isDataReady ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full"
                style={{ gridColumn: "1 / -1" }}
              >
                {spaces.map((space) => (
                  <motion.div key={space.id} variants={itemVariants}>
                    <SpaceCard
                      space={space}
                      enableJoin={true}
                      onJoin={onJoin}
                      isMember={joinedSpaceIds.includes(space.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              spaces.map((space) => (
                <div key={space.id}>
                  <SpaceCard
                    space={space}
                    enableJoin={true}
                    onJoin={onJoin}
                    isMember={joinedSpaceIds.includes(space.id)}
                  />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border-indigo-100 dark:border-indigo-900">
            <CardContent className="p-0">
              <div className="divide-y divide-indigo-100 dark:divide-indigo-900">
                {loading
                  ? Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-60" />
                          </div>
                          <Skeleton className="h-8 w-16 rounded-md" />
                        </div>
                      ))
                  : spaces.map((space) => (
                      <div
                        key={space.id}
                        className="p-4 flex items-center gap-4"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                            {space.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{space.name}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {space.description || "No description available"}
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {space.user_count !== undefined
                                ? space.user_count
                                : "-"}
                            </span>
                          </div>
                        </div>
                        {joinedSpaceIds.includes(space.id) ? (
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                          >
                            Member
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => onJoin(space.id)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                          >
                            Join
                          </Button>
                        )}
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
