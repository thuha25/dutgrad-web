"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { spaceService } from "@/services/api/space.service";
import { toast, Toaster } from "sonner";
import { APP_ROUTES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, Lock, Globe } from "lucide-react";

export default function CreateSpacePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleCreateSpace = async () => {
    let hasError = false;

    setNameError("");
    setDescriptionError("");

    if (!name.trim()) {
      setNameError("Please enter space name");
      hasError = true;
    }

    if (!description.trim()) {
      setDescriptionError("Please enter space description");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const payload = {
        name,
        description,
        privacy_status: isPrivate,
      };

      await spaceService.createSpace(payload);
      toast.success("Create space successfully!");
      router.push(APP_ROUTES.SPACES.MINE);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        const errorMsg =
          error.response.data?.error || error.response.data?.message || "";
        toast.error("Space creation limit reached", {
          description: `Error: ${errorMsg}`,
          duration: 6000,
        });
      } else {
        toast.error("Create Space failed!", {
          description: error.message || "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const formControlVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-xl"
      >
        <Card className="shadow-xl rounded-2xl border border-primary/1 bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <CardTitle className="text-5xl font-extrabold text-center text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                  Create New Space
                </span>
              </CardTitle>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </motion.div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              custom={1}
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
            >
              <Label
                htmlFor="name"
                className="mb-4 text-gray-700 dark:text-gray-300"
              >
                Space Name
              </Label>
              <Input
                id="name"
                placeholder="Enter the space name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {nameError && (
                <motion.p
                  className="text-sm text-red-500 mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {nameError}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              custom={2}
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
            >
              <Label
                htmlFor="description"
                className="mb-4 text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a description for the space"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {descriptionError && (
                <motion.p
                  className="text-sm text-red-500 mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {descriptionError}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              custom={3}
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-pink-50 dark:from-gray-800 dark:to-purple-900/20 p-4 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isPrivate ? 0 : 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {isPrivate ? (
                    <Lock className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Globe className="h-5 w-5 text-blue-500" />
                  )}
                </motion.div>
                <Label
                  htmlFor="privacy"
                  className="text-gray-700 dark:text-gray-300"
                >
                  {isPrivate ? "Private Space" : "Public Space"}
                </Label>
              </div>
              <Switch
                id="privacy"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                className="data-[state=checked]:bg-purple-600"
              />
            </motion.div>

            <motion.div
              custom={4}
              variants={formControlVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
                onClick={handleCreateSpace}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  "Create Space"
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
