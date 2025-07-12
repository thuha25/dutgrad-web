"use client";

import type React from "react";

import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { cn } from "@/lib/utils";

type MessageProps = {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    isTempMessage?: boolean;
  };
};

export default function ChatMessage({ message }: MessageProps) {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const tempMessageVariants = {
    initial: { opacity: 0.4 },
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
    exit: { opacity: 0 },
  };

  if (message.isTempMessage) {
    return (
      <motion.div
        className="flex items-start gap-3 p-6 rounded-lg max-w-[80%] w-fit bg-muted self-start"
        initial={{ opacity: 0, y: 20 }}
        animate={tempMessageVariants.animate}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {message.content ? message.content : "AI is thinking"}
            </span>
            {!message.content && (
              <motion.span
                className="inline-block ml-1"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <span className="text-sm">...</span>
              </motion.span>
            )}
          </div>
          {message.content && (
            <motion.div
              className="w-16 h-1 bg-primary/20 rounded-full mt-1"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <span className="text-xs text-muted-foreground">Just now</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "inline-flex items-start gap-3 p-4 rounded-lg overflow-hidden max-w-[80%] w-fit",
        message.isUser
          ? "bg-primary text-primary-foreground self-end ml-auto flex-row-reverse"
          : "bg-muted self-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {!message.isUser && (
        <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-1",
          message.isUser ? "items-end text-right" : ""
        )}
      >
        {message.isUser ? (
          <p className="text-sm break-words">{message.content}</p>
        ) : (
          <div className="text-sm break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 break-words">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold mb-2">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-md font-bold mb-2">{children}</h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="break-words">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary underline break-words"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-2">
                    {children}
                  </blockquote>
                ),
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: React.ComponentPropsWithoutRef<"code"> & {
                  inline?: boolean;
                }) => {
                  if (inline) {
                    return (
                      <code
                        className="px-1 py-0.5 rounded bg-muted text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="w-full overflow-hidden rounded-md my-2">
                      <pre className="p-3 bg-muted-foreground/20 overflow-x-auto font-mono text-sm whitespace-pre-wrap break-words">
                        <code {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                },
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                img: ({ src, alt }) => (
                  <img
                    src={src || "/placeholder.svg"}
                    alt={alt || ""}
                    className="max-w-full h-auto rounded-md my-2"
                  />
                ),
                table: ({ children }) => (
                  <ScrollableTable className="my-4 w-full max-w-full">
                    <table
                      className="w-full border-collapse text-sm"
                      style={{ tableLayout: "fixed", width: "100%" }}
                    >
                      {children}
                    </table>
                  </ScrollableTable>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted-foreground/10">{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr className="border-b border-muted-foreground/20 m-0 p-0 even:bg-muted-foreground/5">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="border border-muted-foreground/20 px-4 py-2 text-left font-semibold whitespace-nowrap">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    className="border border-muted-foreground/20 px-4 py-2 text-left overflow-hidden text-ellipsis"
                    style={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                    }}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <span
          className={cn(
            "text-xs",
            message.isUser
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}
