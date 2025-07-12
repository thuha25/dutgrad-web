"use client";

import { Button } from "@/components/ui/button";
import { API_ROUTES } from "@/lib/constants";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export function ChatbotSection() {
  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="container px-6 md:px-12 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUpVariants}
            className="flex flex-col justify-between space-y-6 h-full"
          >
            <div className="flex flex-col justify-start space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Meet Your Document Assistant
                </h2>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Our AI chatbot understands your questions and finds exactly
                  what you need from your documents with unprecedented accuracy.
                </p>
              </div>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="space-y-3"
              >
                {[
                  "Ask complex questions about your documents",
                  "Get summaries of long documents instantly",
                  "Compare information across multiple files",
                  "Extract specific data points with citations",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center text-base"
                  >
                    <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-4"
            >
              <Button size="lg" className="text-base px-8 py-6 h-auto">
                <Link href={API_ROUTES.AUTH.LOGIN}>Try the Demo</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
              <div className="bg-gradient-to-r from-primary to-indigo-600 p-4 text-primary-foreground">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">DUTGrad Assistant</h3>
                </div>
              </div>
              <div className="p-4 h-96 bg-muted/30 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  {[
                    {
                      isUser: false,
                      text: "Hello! I'm your DUTGrad Assistant. How can I help you with your documents today?",
                    },
                    {
                      isUser: true,
                      text: "Where is the quarterly financial report from Q2 2023?",
                    },
                    {
                      isUser: false,
                      text: "I found the Q2 2023 financial report in your Finance folder. It was uploaded on July 15, 2023. Would you like me to summarize the key points or open the document?",
                    },
                    {
                      isUser: true,
                      text: "Summarize the revenue growth compared to Q1, please.",
                    },
                    {
                      isUser: false,
                      text: "According to the Q2 2023 report, revenue grew by 18.7% compared to Q1 2023, exceeding the projected growth of 15%. The main drivers were the new product line (contributing 7.3%) and expansion into European markets (contributing 6.2%).",
                    },
                  ].map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.5, duration: 0.5 }}
                      className={`flex items-start ${
                        message.isUser ? "justify-end" : ""
                      }`}
                    >
                      <div
                        className={`${
                          message.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-foreground"
                        } rounded-lg p-3 max-w-[85%] shadow-sm`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-border bg-background">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask about your documents..."
                    className="flex-1 px-3 py-2 bg-muted border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
