"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number | null;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
  color: string;
  accentColor: string;
  animate?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  loading,
  color,
  accentColor,
  animate = true,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 relative">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-90 z-0`}
      ></div>
      <div
        className="absolute right-0 top-0 w-32 h-32 rounded-full"
        style={{
          background: accentColor,
          filter: "blur(40px)",
          transform: "translate(30%, -30%)",
        }}
      ></div>

      <CardHeader className="relative z-10 pb-2 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium">{title}</CardTitle>
          <div className="rounded-full p-2 bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0 text-white">
        {loading ? (
          <Skeleton className="h-12 w-28 bg-white/20 mb-2" />
        ) : (
          <div className="text-4xl font-bold mb-2 flex items-baseline">
            {value !== null ? value.toLocaleString() : "—"}
            <span className="text-sm ml-1 opacity-80">total</span>
          </div>
        )}
        <p className="text-sm text-white/80">{description}</p>

        <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
          {animate ? (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "70%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-white/60 rounded-full"
            />
          ) : (
            <div className="h-full bg-white/60 rounded-full w-[70%]" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
