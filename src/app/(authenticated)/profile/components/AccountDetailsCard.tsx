"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  Mail,
  Calendar,
  Shield,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { spaceService } from "@/services/api/space.service";
import { documentService } from "@/services/api/document.service";

interface AccountDetailsCardProps {
  user: any;
  mfaStatus: boolean;
}

export function AccountDetailsCard({
  user,
  mfaStatus,
}: AccountDetailsCardProps) {
  const [spaceCount, setSpaceCount] = useState<number>(0);
  const [documentCount, setDocumentCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const spaceCountValue = await spaceService.getCountMySpace();
        setSpaceCount(spaceCountValue);
        
        const documentCountValue = await documentService.getCountMyDocuments();
        setDocumentCount(documentCountValue);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Full Name
            </dt>
            <dd className="mt-1 font-medium">{user.username}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Created At
            </dt>
            <dd className="mt-1 font-medium">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Two-Factor Authentication
            </dt>
            <dd className="mt-1 font-medium flex items-center">
              {mfaStatus ? (
                <>
                  <Badge
                    variant="default"
                    className="bg-green-500 text-white flex items-center gap-1 mr-2"
                  >
                    <Check className="h-3 w-3" />
                    Enabled
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Your account is protected
                  </span>
                </>
              ) : (
                <>
                  <Badge
                    variant="outline"
                    className="border-amber-500 text-amber-500 flex items-center gap-1 mr-2"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Disabled
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Enable 2FA for better security
                  </span>
                </>
              )}
            </dd>
          </div>
          <div className="pt-4 mt-4 border-t">
            <h3 className="font-semibold mb-3">Account Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Spaces
                </p>
                <p className="text-2xl font-bold mt-1">{spaceCount}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  Documents
                </p>
                <p className="text-2xl font-bold mt-1">{documentCount}</p>
              </div>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
