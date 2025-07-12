import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

interface DeleteMemberModalProps {
  memberName: string;
  memberRole: string;
  isOwner: boolean;
  isPending?: boolean;
  onConfirm: () => Promise<void>;
}

export function DeleteMemberModal({
  memberName,
  memberRole,
  isOwner,
  isPending = false,
  onConfirm,
}: DeleteMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const title = isPending ? "Cancel Invitation" : "Remove Member";
  const description = isPending
    ? `Are you sure you want to cancel the invitation for ${memberName}?`
    : `Are you sure you want to remove ${memberName} from this space?`;
  const actionText = isPending ? "Cancel Invitation" : "Remove Member";
  const warningText = isPending
    ? "This will permanently delete the invitation."
    : "This action cannot be undone. The user will lose access to this space and all its resources.";

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setIsOpen(true)}
        disabled={isOwner}
        title={isOwner ? "Cannot remove an owner" : isPending ? "Cancel invitation" : "Remove member"}
      >
        <FaTrash />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center p-4 mb-4 bg-muted rounded-lg">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-semibold uppercase mr-3">
                {memberName[0]}
              </div>
              <div>
                <p className="font-medium">{memberName}</p>
                <p className="text-sm text-muted-foreground">
                  {memberRole}
                  {isPending && <span className="ml-2 text-yellow-500">(Pending)</span>}
                </p>
              </div>
            </div>
            
            <p className="text-destructive text-sm">
              {warningText}
            </p>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : null}
              {isDeleting ? (isPending ? "Canceling..." : "Removing...") : actionText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}