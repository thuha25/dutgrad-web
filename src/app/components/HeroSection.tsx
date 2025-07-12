"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_ROUTES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background with professional gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-slate-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-slate-950/20" />

      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ delay: 1, duration: 2 }}
        className="absolute top-20 right-[15%] w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 1.5, duration: 2 }}
        className="absolute bottom-20 left-[10%] w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl"
      />

      <div className="container px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/80 dark:border-blue-800 dark:bg-blue-950/50 px-4 py-2 text-sm text-blue-700 dark:text-blue-300 backdrop-blur-sm"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Introducing DUTGrad AI Assistant
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                  Smart Document
                </span>
                <br />
                <span className="text-slate-900 dark:text-slate-100">
                  Storage Powered by AI
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-[600px] text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed mt-6"
              >
                Store, organize, and retrieve your documents instantly with our
                AI-powered chatbot. Ask questions in natural language and get
                precise answers from your document collection.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button
                size="lg"
                className="group text-white px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link href={API_ROUTES.AUTH.REGISTER}>Get Started Free</Link>

                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  className="ml-2"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group text-base px-8 py-6 h-auto border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Link href={API_ROUTES.AUTH.LOGIN}>
                  or continue where you left off
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group text-base px-8 py-6 h-auto border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 hidden"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100/80 via-indigo-100/60 to-slate-100/80 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-slate-900/40 rounded-2xl shadow-2xl overflow-hidden border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-black/10 [mask-image:linear-gradient(0deg,transparent,#000)]"></div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-center space-y-4"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-300/30 dark:border-blue-700/30"
                    >
                      <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300">
                      AI-Powered Intelligence
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Advanced document analysis and retrieval
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-blue-100/80 dark:bg-blue-900/40 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50"
              />
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-indigo-100/80 dark:bg-indigo-900/40 rounded-full backdrop-blur-sm border border-indigo-200/50 dark:border-indigo-800/50"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
