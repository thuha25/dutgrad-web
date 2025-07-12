import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Loading document information...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
