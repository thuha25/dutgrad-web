"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { spaceService } from "@/services/api/space.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, Trash2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { APP_ROUTES } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DangerZoneProps {
  spaceId: string;
  spaceName: string;
}

export function DangerZone({ spaceId, spaceName }: DangerZoneProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteSpace = async () => {
    if (!spaceId) return;

    if (confirmText !== spaceName) {
      toast.error("Please type the space name correctly to confirm deletion");
      return;
    }

    setIsDeleting(true);
    try {
      await spaceService.deleteSpace(spaceId);
      toast.success("Space deleted successfully", {
        description: "You'll be redirected to your spaces",
      });
      router.push(APP_ROUTES.SPACES.MINE);
    } catch (error) {
      console.error("Failed to delete space:", error);
      toast.error("Failed to delete space", {
        description: "Please try again later",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div>
      <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Destructive actions that cannot be undone
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md p-5 bg-destructive/5 border border-destructive/20">
            <h3 className="font-medium flex items-center gap-2">
              <Trash2 size={16} className="text-destructive" />
              Delete this space
            </h3>

            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Once you delete a space, there is no going back. All documents,
              conversations, and data will be permanently deleted.
            </p>

            <div className="bg-background/80 p-4 rounded-md mb-6 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} className="text-muted-foreground" />
                <h4 className="font-medium">What will be deleted:</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
                <li>All documents and files in this space</li>
                <li>All conversation history</li>
                <li>All member access and permissions</li>
                <li>All space settings and configurations</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Space
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle size={18} />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the space
                    <span className="font-semibold"> {spaceName} </span>
                    and all of its documents and data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="bg-muted/30 p-3 rounded-md border text-sm my-2">
                  To confirm, please type{" "}
                  <span className="font-bold">{spaceName}</span> below:
                  <Input
                    className="mt-2"
                    placeholder={`Type "${spaceName}" to confirm`}
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSpace}
                    className="bg-destructive hover:bg-destructive/90 gap-2"
                    disabled={isDeleting || confirmText !== spaceName}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Delete Space
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
