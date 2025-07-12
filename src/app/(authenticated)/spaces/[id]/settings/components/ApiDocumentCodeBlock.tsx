"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden", className)}>
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/60"
          onClick={copyToClipboard}
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <Highlight theme={themes.vsDark} code={code} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              className,
              "py-4 px-4 overflow-x-auto text-xs font-mono",
              showLineNumbers && "pl-12 relative"
            )}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {showLineNumbers && (
                  <span className="absolute left-0 px-3 text-gray-500 select-none">
                    {i + 1}
                  </span>
                )}
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
