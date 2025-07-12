"use client";

import React from "react";

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
}

export function ActivityItem({
  icon,
  title,
  description,
  time,
  color,
}: ActivityItemProps) {
  return (
    <div className="p-4 flex items-center gap-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors">
      <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
    </div>
  );
}
