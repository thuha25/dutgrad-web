"use client";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { spaceService } from "@/services/api/space.service";
import { 
  PageHeader,
  LoadingState,
  EmptyState,
  InvitationList
} from "./components";

export default function MyInvitationsPage() {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await spaceService.getMyInvitations();
      setInvitations(res.invitations);
    } catch (err: any) {
      toast.error("Failed to fetch invitations");
    } finally {
      setLoading(false);
    }
  };
  const handleJoin = async (invitationId: string) => {
    try {
      const response = await spaceService.acceptInvitation(invitationId);
      const spaceId = response.space_id;
      
      if (spaceId) {
        toast.success("Successfully joined the space! Redirecting...");
        window.location.href = `/spaces/${spaceId}`;
      } else {
        toast.success("Successfully joined the space!");
        fetchInvitations();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to join space");
    }
  };

  const handleReject = async (invitationId: string) => {
    try {
      await spaceService.rejectInvitation(invitationId);
      toast.success("Invitation rejected successfully!");
      await fetchInvitations();
    } catch (err: any) {
      toast.error("Failed to reject invitation");
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Toaster position="top-right" richColors />
      
      <PageHeader loading={loading} onRefresh={fetchInvitations} />

      {loading ? (
        <LoadingState />
      ) : invitations.length === 0 ? (
        <EmptyState />
      ) : (
        <InvitationList 
          invitations={invitations}
          onAccept={handleJoin}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
