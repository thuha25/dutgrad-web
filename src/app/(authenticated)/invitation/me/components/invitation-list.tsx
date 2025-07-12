"use client";
import { InvitationCard } from "./invitation-card";

interface InvitationListProps {
  invitations: any[];
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
}

export function InvitationList({ 
  invitations, 
  onAccept, 
  onReject 
}: InvitationListProps) {
  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <InvitationCard 
          key={invitation.id}
          invitation={invitation}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
}
