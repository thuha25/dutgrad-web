"use client";

import { useEffect, useState, useCallback } from "react";
import { spaceService } from "@/services/api/space.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSpace } from "@/context/space.context";
import { SPACE_ROLE, APP_ROUTES } from "@/lib/constants";
import { SpaceRoleGuard } from "@/components/space/SpaceRoleGuard";
import { InviteModal } from "./components/InviteModal";
import { DeleteMemberModal } from "./components/DeleteMemberModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export interface Member {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
  };
  space_role: {
    id: number;
    name: string;
  };
  created_at: string;
}

export interface SpaceRole {
  id: number;
  name: string;
}

export interface Invitation {
  id: number;
  invited_user: {
    id: number;
    username: string;
    email: string;
  };
  space_role: {
    id: number;
    name: string;
  };
  created_at: string;
  status: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function SpaceMembersPage() {
  const { space, role } = useSpace();
  const id = space?.id?.toString() || "";
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [spaceRoles, setSpaceRoles] = useState<SpaceRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingRoleFor, setUpdatingRoleFor] = useState<number | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const [resMembers, resInvitations, resRoles] = await Promise.all([
        spaceService.getSpaceMembers(id),
        spaceService.getSpaceInvitations(id),
        spaceService.getSpaceRoles(),
      ]);

      setMembers(resMembers.members);
      setInvitations(resInvitations.invitations);
      setSpaceRoles(resRoles.roles);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load members data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = async (memberId: number, roleId: number) => {
    try {
      setUpdatingRoleFor(memberId);
      await spaceService.updateUserRole(id, memberId.toString(), roleId);

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.user.id === memberId
            ? {
                ...member,
                space_role: {
                  id: roleId,
                  name:
                    spaceRoles.find((r) => r.id === roleId)?.name ||
                    member.space_role.name,
                },
              }
            : member
        )
      );

      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
      fetchData();
    } finally {
      setUpdatingRoleFor(null);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    try {
      setRemovingMemberId(memberId);
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.user.id !== memberId)
      );
      setInvitations((prevInvitations) =>
        prevInvitations.filter(
          (invitation) => invitation.invited_user.id !== memberId
        )
      );
      await spaceService.removeMember(id, memberId.toString());
      toast.success("Member removed successfully");
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      toast.error(error.response?.data?.message || "Failed to remove member");
      fetchData();
    } finally {
      setRemovingMemberId(null);
    }
  };

  const combinedData = [
    ...members.map((m) => ({
      id: m.id,
      userId: m.user.id,
      username: m.user.username,
      roleId: m.space_role.id,
      role: m.space_role.name,
      joinDate: m.created_at,
      status: "",
      isPending: false,
    })),
    ...invitations
      .filter((i) => i.status !== "accepted" && i.status !== "rejected")
      .map((i) => ({
        id: i.id,
        userId: i.invited_user.id,
        username: i.invited_user.username,
        roleId: i.space_role.id,
        role: i.space_role.name,
        joinDate: i.created_at,
        status: i.status,
        isPending: true,
      })),
  ].sort(
    (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
  );
  return (
    <motion.div
      className="py-12 px-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="relative mb-8">
        <Button
          variant="outline"
          size="sm"
          className="absolute left-0 top-0 flex items-center gap-1"
          onClick={() => router.push(APP_ROUTES.SPACES.DETAIL(id))}
        >
          <ChevronLeft className="h-4 w-4" /> Back to Space
        </Button>
      </div>
      
      <motion.h1
        className="text-3xl font-extrabold text-center text-gray-900 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          Members
        </span>
      </motion.h1>
      <SpaceRoleGuard whitelist={[SPACE_ROLE.OWNER]}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <InviteModal
            members={members}
            invitations={invitations}
            onSuccess={() => fetchData()}
          />
        </motion.div>
      </SpaceRoleGuard>
      <motion.div
        className="bg-background shadow-lg rounded-xl p-6 overflow-x-auto mt-2"
        variants={tableContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="popLayout">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <motion.tr
                        key={`skeleton-${index}`}
                        variants={tableRowVariants}
                        className="bg-muted/50"
                        style={{ height: "56px" }}
                      >
                        {Array(4)
                          .fill(0)
                          .map((_, cellIndex) => (
                            <motion.td
                              key={`skeleton-cell-${cellIndex}`}
                              className="px-4 py-3"
                            >
                              <motion.div
                                className="h-4 bg-muted rounded"
                                animate={{
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 1.5,
                                }}
                              />
                            </motion.td>
                          ))}
                      </motion.tr>
                    ))
                : combinedData.map((item, index) => (
                    <motion.tr
                      key={`${item.userId}-${index}`}
                      className="hover:bg-muted/50 transition cursor-pointer"
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05,
                      }}
                    >
                      <TableCell className="flex items-center gap-3">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-semibold uppercase"
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.username[0]}
                        </motion.div>
                        <span>{item.username}</span>
                        {item.status === "pending" && (
                          <motion.span
                            className="text-yellow-500 ml-2 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            (Pending)
                          </motion.span>
                        )}
                      </TableCell>
                      <TableCell>
                        <SpaceRoleGuard
                          whitelist={[SPACE_ROLE.OWNER]}
                        >
                          {!item.status ? (
                            <Select
                              defaultValue={item.roleId.toString()}
                              disabled={
                                updatingRoleFor === item.id ||
                                item.roleId === SPACE_ROLE.OWNER
                              }
                              onValueChange={(value) =>
                                handleRoleChange(
                                  item.userId,
                                  Number.parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={item.role} />
                              </SelectTrigger>
                              <SelectContent>
                                {spaceRoles.map((role) => (
                                  <SelectItem
                                    key={role.id}
                                    value={role.id.toString()}
                                    disabled={role.id === SPACE_ROLE.OWNER}
                                  >
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <>{item.role}</>
                          )}
                        </SpaceRoleGuard>
                        <SpaceRoleGuard
                          whitelist={[SPACE_ROLE.EDITOR, SPACE_ROLE.VIEWER]}
                        >
                          {item.role}
                        </SpaceRoleGuard>
                      </TableCell>
                      <TableCell>
                        {new Date(item.joinDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <SpaceRoleGuard
                          whitelist={[SPACE_ROLE.OWNER]}
                        >
                          <DeleteMemberModal
                            memberName={item.username}
                            memberRole={item.role}
                            isOwner={item.roleId === SPACE_ROLE.OWNER}
                            isPending={item.isPending}
                            onConfirm={() => handleRemoveMember(item.userId)}
                          />
                        </SpaceRoleGuard>
                      </TableCell>
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
