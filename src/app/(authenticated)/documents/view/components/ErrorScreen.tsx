import { Button } from '@/components/ui/button';
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorScreenProps {
  errorMessage: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorScreen({ 
  errorMessage, 
  actionLabel = "Go back", 
  onAction 
}: ErrorScreenProps) {
  const router = useRouter();
  
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.back();
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-destructive mb-2">
          {errorMessage}
        </h2>
        <Button variant="outline" onClick={handleAction}>
          <ChevronLeft className="mr-2 h-4 w-4" /> {actionLabel}
        </Button>
      </div>
    </div>
  );
}
