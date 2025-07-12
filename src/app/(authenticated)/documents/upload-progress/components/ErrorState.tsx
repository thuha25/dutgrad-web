import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  errorMessage: string;
}

export function ErrorState({ errorMessage }: ErrorStateProps) {
  const router = useRouter();
  
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
      <div className="mt-4 flex justify-center">
        <Button onClick={() => router.push(APP_ROUTES.DASHBOARD)}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
