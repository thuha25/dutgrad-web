"use client";
import { XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface InvitationCardProps {
  invitation: any;
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
}

export function InvitationCard({
  invitation,
  onAccept,
  onReject,
}: InvitationCardProps) {
  return (
    <Card key={invitation.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <span className="mr-2">{invitation.space.name}</span>
          {invitation.space.privacy_status === false && (
            <Badge variant="secondary" className="text-xs">
              Public
            </Badge>
          )}
          {invitation.space.privacy_status === true && (
            <Badge variant="secondary" className="text-xs">
              Private
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex flex-row justify-between items-center">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-50"
              >
                {invitation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Invited by{" "}
              <span className="font-medium">
                {invitation.inviter?.username || "Unknown"}
              </span>
            </p>
            {invitation.message && (
              <p className="text-sm italic border-l-2 pl-2 border-gray-200 dark:border-gray-700">
                &ldquo;{invitation.message}&rdquo;
              </p>
            )}
          </div>
          {invitation.status === "pending" ? (
            <div className="flex">
              <Button
                variant="outline"
                onClick={() => onReject(invitation.id)}
                className="mr-2 gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                size="sm"
              >
                <XCircle className="w-4 h-4" /> Decline
              </Button>
              <Button
                onClick={() => onAccept(invitation.id)}
                className="gap-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="sm"
              >
                <CheckCircle className="w-4 h-4" /> Accept
              </Button>
            </div>
          ) : (
            <Badge
              variant="outline"
              className={`text-sm ${
                invitation.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {invitation.status === "accepted" ? "Joined" : "Declined"}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
