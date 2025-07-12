"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Code, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ApiDocumentBlock from "./ApiDocumentBlock";

interface ApiDocumentProps {
  spaceId: string;
}

export default function ApiDocument(props: ApiDocumentProps) {
  const { spaceId } = props;
  const [currentHost, setCurrentHost] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.origin);
    }
  }, [spaceId]);

  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <CardTitle>Chat API Documentation</CardTitle>
        </div>
        <CardDescription>
          Learn how to interact with the Chat API programmatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ApiDocumentBlock spaceId={spaceId} />
      </CardContent>
      <CardFooter className="border-t py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info size={14} />
          <span>
            You need an API key to access these endpoints. Create one in the API
            Keys section.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
