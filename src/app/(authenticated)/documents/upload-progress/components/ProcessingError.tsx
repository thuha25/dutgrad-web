import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ProcessingErrorProps {
  document: {
    id: number;
    title?: string;
    space_id: number;
  } | null;
}

export function ProcessingError({ document }: ProcessingErrorProps) {
  const router = useRouter();
  
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Document Processing Failed</CardTitle>
          {document?.title && (
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              {document.title}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive" className="flex flex-col items-center py-6">
            <AlertCircle className="h-12 w-12 mb-4" />
            <AlertDescription className="text-center text-base">
              <p className="font-medium mb-2">We encountered an error while processing your document.</p>
              <p>This could be due to the file format, size, or content. Please try uploading the document again or use a different file.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            className="gap-2"
            onClick={() => router.push(`/spaces/${document?.space_id}?openImport=true`)}
          >
            <Upload className="h-4 w-4" />
            Upload Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/spaces/${document?.space_id}`)}
          >
            Return to Space
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
