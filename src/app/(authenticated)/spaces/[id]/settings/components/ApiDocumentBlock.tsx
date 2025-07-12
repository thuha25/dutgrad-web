"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircleIcon,
  CheckCircle2,
  Code,
  Copy,
  KeyIcon,
  SendIcon,
  ServerIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./ApiDocumentCodeBlock";

interface ApiDocumentBlockProps {
  spaceId: string;
}

export default function ApiDocumentBlock(props: ApiDocumentBlockProps) {
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

  const endpoint = `${currentHost}/api/v1/spaces/${spaceId}/chat`;

  const curlCode = `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -d "{"query": "What is this space about?"}"`;

  const httpCode = `POST /api/v1/spaces/${spaceId}/chat HTTP/1.1
Host: ${currentHost.replace(/^https?:\/\//, "")}
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN

{
  "query": "What is this space about?"
}`;

  const javascriptCode = `const response = await fetch("${endpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_TOKEN"
  },
  body: JSON.stringify({
    query: "What is this space about?"
  })
});

const data = await response.json();
console.log(data);`;

  const pythonCode = `import requests

response = requests.post(
    "${endpoint}",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_TOKEN"
    },
    json={
        "query": "What is this space about?"
    }
)

data = response.json()
print(data)`;

  const requestBodyCode = `{
  "query": "Your query",
  "query_session_id": "session_id"  // optional
}`;

  const responseBodyCode = `{
  "status": 200,
  "message": "Success",
  "data": {
    "answer": "Response from the AI",
    "session_id": 12345,
    "query": "Your query"
  }
}`;

  const errorResponseCode = `{
  "error": "Error message",
  "status": 400,
  "message": "Detailed error description"
}`;

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <ServerIcon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Endpoint</h3>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
          <Badge variant="secondary">POST</Badge>
          <code className="font-mono text-xs flex-1">{endpoint}</code>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => copyToClipboard(endpoint)}
          >
            <Copy size={14} />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <KeyIcon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Authentication</h3>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm mb-2">Add this header to your requests:</p>
          <div className="relative">
            <CodeBlock
              code="Authorization: Bearer YOUR_API_TOKEN"
              language="bash"
              className="bg-background/50"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-7 w-7 p-0"
              onClick={() =>
                copyToClipboard("Authorization: Bearer YOUR_API_TOKEN")
              }
            >
              <Copy size={12} />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <SendIcon className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Request Body</h3>
          </div>
          <div className="relative">
            <CodeBlock
              code={requestBodyCode}
              language="json"
              showLineNumbers
              className="bg-background/50 h-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-7 w-7 p-0"
              onClick={() => copyToClipboard(requestBodyCode)}
            >
              <Copy size={12} />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Code className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Response</h3>
          </div>
          <div className="relative">
            <CodeBlock
              code={responseBodyCode}
              language="json"
              showLineNumbers
              className="bg-background/50 h-full"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-7 w-7 p-0"
              onClick={() => copyToClipboard(responseBodyCode)}
            >
              <Copy size={12} />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircleIcon className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-semibold">Error Response</h3>
        </div>
        <div className="relative">
          <CodeBlock
            code={errorResponseCode}
            language="json"
            showLineNumbers
            className="bg-background/50"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-7 w-7 p-0"
            onClick={() => copyToClipboard(errorResponseCode)}
          >
            <Copy size={12} />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold mb-2">Code Examples</h3>
        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="http">HTTP</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="mt-2">
            <CodeBlock
              code={curlCode}
              language="bash"
              showLineNumbers
              className="bg-background/50"
            />
          </TabsContent>

          <TabsContent value="http" className="mt-2">
            <CodeBlock
              code={httpCode}
              language="http"
              showLineNumbers
              className="bg-background/50"
            />
          </TabsContent>

          <TabsContent value="javascript" className="mt-2">
            <CodeBlock
              code={javascriptCode}
              language="javascript"
              showLineNumbers
              className="bg-background/50"
            />
          </TabsContent>

          <TabsContent value="python" className="mt-2">
            <CodeBlock
              code={pythonCode}
              language="python"
              showLineNumbers
              className="bg-background/50"
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
