"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface GettingStartedTipsProps {
  onShowGuide: () => void;
}

export function GettingStartedTips({ onShowGuide }: GettingStartedTipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-primary/5 border border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10 mt-1">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Getting Started Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Join a space from the Popular Spaces section below
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  {`Create your own space by clicking "Create Space" in the sidebar`}
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  Start a chat session within any space you join or create
                </li>
              </ul>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10"
                  onClick={onShowGuide}
                >
                  Show Guide Again
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
