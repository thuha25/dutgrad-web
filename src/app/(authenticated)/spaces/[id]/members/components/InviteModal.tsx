"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSpace } from "@/context/space.context";
import { spaceService } from "@/services/api/space.service";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import type { Invitation, Member } from "../page";
import { userService, type User } from "@/services/api/user.service";
import {
  Copy,
  Link2,
  Loader2,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InviteModalProps {
  onSuccess: () => void | Promise<void> | undefined;
  members: Member[];
  invitations: Invitation[];
}

export function InviteModal(props: InviteModalProps) {
  const { space } = useSpace();
  const id = space?.id?.toString() || "";

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [invitationLink, setInvitationLink] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const { onSuccess, members, invitations } = props;

  const filterExistingUsers = (users: User[]) => {
    const memberIds = new Set(members.map((member) => member.user.id));
    const invitationEmails = new Set(
      invitations.map((inv) => inv.invited_user.email)
    );

    return users.filter(
      (user) => !memberIds.has(user.id) && !invitationEmails.has(user.email)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const resRoles = await spaceService.getSpaceRoles();
      setRoles(resRoles.roles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const result = await userService.searchUsers(searchQuery);
        setSearchResults(filterExistingUsers(result.users));
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery, members, invitations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInvite = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to invite");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      await spaceService.inviteUser(id, selectedUser.id, selectedRole, inviteMessage);
      toast.success("Invite sent successfully.");
      onSuccess?.();
      setSelectedUser(null);
      setSearchQuery("");
      setInviteMessage("");
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send invitation.";
      toast.error(errorMessage);
    }
  };

  const handleRoleChange = async (value: string) => {
    const roleId = Number(value);
    setSelectedRole(roleId);
    setIsLoadingLink(true);

    try {
      const res = await spaceService.getOrCreateInviteLink(id, roleId);
      setInvitationLink(res.invitation_link);
    } catch (error) {
      toast.error("Failed to get invitation link.");
    } finally {
      setIsLoadingLink(false);
    }
  };

  const handleCopy = () => {
    if (invitationLink) {
      navigator.clipboard.writeText(invitationLink);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Invite User to Space</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-1">User</p>

            <div className="relative">
              {selectedUser ? (
                <div className="flex items-center justify-between border rounded-md p-2">
                  <div className="flex items-center">
                    <span className="mr-2 font-medium">
                      {selectedUser.username}
                    </span>
                    <span className="text-muted-foreground">
                      ({selectedUser.email})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={clearSelectedUser}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      className="pl-8"
                    />
                  </div>

                  {showSearchResults && (
                    <div
                      ref={searchResultsRef}
                      className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md max-h-[200px] overflow-y-auto"
                    >
                      {searching && (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Searching...</span>
                        </div>
                      )}

                      {!searching &&
                        searchQuery.length > 0 &&
                        searchResults.length === 0 && (
                          <div className="p-4 text-center text-muted-foreground">
                            {searchQuery.length > 1
                              ? "No users found."
                              : "Type at least 2 characters to search."}
                          </div>
                        )}

                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex flex-col">
                            <span>{user.username}</span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-1">Role</p>
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.slice(1).map((role) => (
                    <SelectItem key={role.id} value={String(role.id)}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-1">Message (Optional)</p>
            <Input
              placeholder="Add a message about this space..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground mb-1">
                Invitation Link
              </p>
              {isLoadingLink && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 transition-opacity",
                !selectedRole ? "opacity-50" : "opacity-100"
              )}
            >
              <div className="relative flex-1">
                <Input
                  value={
                    invitationLink ||
                    "Select a role to generate invitation link"
                  }
                  readOnly
                  className="pr-10"
                  disabled={!selectedRole}
                />
                {selectedRole && invitationLink && (
                  <Link2 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Button
                onClick={handleCopy}
                disabled={!selectedRole || !invitationLink}
                variant="outline"
                size="icon"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedRole
                ? "Share this link to let others join your space with the selected role"
                : "Select a role above to generate an invitation link"}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleInvite}
              disabled={!selectedUser || !selectedRole}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
