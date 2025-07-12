import { Button } from '@/components/ui/button';
import { ChevronLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from 'react';

interface DocumentHeaderProps {
  title: string;
  icon: ReactNode;
  downloadUrl: string;
  downloadFileName: string;
  onBack?: () => void;
}

export function DocumentHeader({
  title,
  icon,
  downloadUrl,
  downloadFileName,
  onBack
}: DocumentHeaderProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-2 px-4 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-primary">
            {icon}
          </span>
          <div className="font-medium text-base">{title}</div>
        </div>
      </div>
      <a
        href={downloadUrl}
        download={downloadFileName}
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition flex items-center gap-1"
      >
        <Download size={16} />
        <span className="text-sm">Download</span>
      </a>
    </div>
  );
}
