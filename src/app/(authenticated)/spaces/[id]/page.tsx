"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { spaceService } from "@/services/api/space.service";
import { documentService } from "@/services/api/document.service";
import { chatService } from "@/services/api/chat.service";
import { SpaceRoleGuard } from "@/components/space/SpaceRoleGuard";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFileAlt,
  FaFileWord,
  FaFile,
  FaCheckCircle,
} from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import {
  Bot,
  Clock,
  AlertCircle,
  FileIcon,
  BotIcon as RobotIcon,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Settings,
  Users,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
  Info,
  Filter,
  Download,
} from "lucide-react";
import ImportModal from "./components/ImportModal";
import { APP_ROUTES, SPACE_ROLE } from "@/lib/constants";
import { useSpace } from "@/context/space.context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SpaceDocument {
  id: number;
  name: string;
  description?: string;
  s3_url: string;
  privacy_status: boolean;
  created_at: string;
  mime_type: string;
  size: number;
  processing_status: number;
}

export default function SpaceDetailPage() {
  const { space, role } = useSpace();
  const spaceId = space?.id?.toString() || "";
  const [documents, setDocuments] = useState<SpaceDocument[]>([]);
  const [documentPage, setDocumentPage] = useState<number>(1);
  const [documentTotal, setDocumentTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<SpaceDocument | null>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [documentToView, setDocumentToView] = useState<SpaceDocument | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const res = await spaceService.getDocumentBySpace(
          spaceId,
          documentPage
        );
        setDocuments(res.documents);
        setDocumentTotal(res.total);
      } catch (err) {
        setError("Failed to fetch documents");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [documentPage, spaceId]);

  const router = useRouter();

  const handleOpenChat = async () => {
    if (!spaceId) return;

    setIsStartingChat(true);
    try {
      const chatSession = await chatService.beginChatSession(
        Number.parseInt(spaceId)
      );
      router.push(APP_ROUTES.CHAT.SPACE(spaceId, chatSession.id.toString()));
    } catch (error) {
      console.error("Failed to start chat session:", error);
      toast.error("Failed to start chat session. Please try again.");
    } finally {
      setIsStartingChat(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) {
      return <FaFilePdf className="text-red-500 h-16 w-16" />;
    } else if (
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("xlsx")
    ) {
      return <FaFileExcel className="text-green-600 h-16 w-16" />;
    } else if (mimeType.includes("csv")) {
      return <FaFileCsv className="text-green-400 h-16 w-16" />;
    } else if (mimeType.includes("text/plain") || mimeType.includes("txt")) {
      return <FaFileAlt className="text-gray-500 h-16 w-16" />;
    } else if (mimeType.includes("word") || mimeType.includes("docx")) {
      return <FaFileWord className="text-blue-600 h-16 w-16" />;
    } else {
      return <FaFile className="text-gray-400 h-16 w-16" />;
    }
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.includes("pdf")) {
      return "pdf";
    } else if (
      mimeType.includes("excel") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("xlsx")
    ) {
      return "excel";
    } else if (mimeType.includes("csv")) {
      return "csv";
    } else if (mimeType.includes("text/plain") || mimeType.includes("txt")) {
      return "text";
    } else if (mimeType.includes("word") || mimeType.includes("docx")) {
      return "word";
    } else {
      return "other";
    }
  };

  const getProcessingStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          icon: <Clock className="mr-1" size={14} />,
          text: "Queued",
          variant: "outline" as const,
          progressValue: 5,
          progressColor: "bg-yellow-500",
        };
      case 1:
        return {
          icon: <AlertCircle className="mr-1" size={14} />,
          text: "Processing",
          variant: "secondary" as const,
          progressValue: 50,
          progressColor: "bg-blue-500",
        };
      case 2:
        return {
          icon: <FaCheckCircle className="mr-1" size={14} />,
          text: "Ready",
          variant: "default" as const,
          progressValue: 100,
          progressColor: "bg-green-500",
        };
      default:
        return {
          icon: <AlertCircle className="mr-1 text-red-500" size={14} />,
          text: "Error",
          variant: "outline" as const,
          progressValue: 0,
          progressColor: "bg-gray-500",
        };
    }
  };

  const handleProcessingStatusClick = (documentId: number) => {
    router.push(APP_ROUTES.DOCUMENT.UPLOAD_PROGRESS(documentId.toString()));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      await documentService.deleteDocument(documentToDelete.id.toString());
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
      setDocumentTotal((prev) => prev - 1);
      toast.success(`${documentToDelete.name} has been successfully deleted.`);
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast.error("Failed to delete document. Please try again.");
    } finally {
      setDocumentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (document: SpaceDocument) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleOpenDocument = (document: SpaceDocument) => {
    router.push(`/documents/view?id=${document.id}`);
  };

  const getDocumentViewerUrl = (document: SpaceDocument) => {
    if (document.mime_type.includes("pdf")) {
      return document.s3_url;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      document.s3_url
    )}&embedded=true`;
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeTab === "all" ||
      (activeTab === "processing" && doc.processing_status === 1) ||
      (activeTab === "queued" && doc.processing_status === 0) ||
      (activeTab === "ready" && doc.processing_status === 2);

    const matchesFileType =
      fileTypeFilter === "all" || getFileType(doc.mime_type) === fileTypeFilter;

    return matchesSearch && matchesStatus && matchesFileType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <FileIcon className="h-12 w-12 text-primary" />
          </div>
          <p className="text-xl font-medium text-primary">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(documentTotal / documents.length) || 1;

  if (!space) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Bot className="h-16 w-16 text-muted-foreground mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold mb-2">Oops! Space not found</h1>
          <p className="text-muted-foreground mb-6">
            {"We couldn't find the space you're looking for."}
          </p>
          <Button variant="default" onClick={() => router.push(APP_ROUTES.SPACES.MINE)}>
            ← Back to Spaces
          </Button>
        </motion.div>
      </div>
    );
  }

  const fileTypeOptions = [
    { value: "all", label: "All Types" },
    { value: "pdf", label: "PDF Files" },
    { value: "excel", label: "Excel Files" },
    { value: "word", label: "Word Documents" },
    { value: "csv", label: "CSV Files" },
    { value: "text", label: "Text Files" },
    { value: "other", label: "Other Files" },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-5xl mx-auto relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-0"
            onClick={() => router.push(APP_ROUTES.SPACES.MINE)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>

          <motion.h1
            className="text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {space.name}
          </motion.h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {space.description}
          </p>

          <div className="flex flex-wrap justify-center mt-6 gap-3">
            <Button
              onClick={() => router.push(APP_ROUTES.SPACES.MEMBER(spaceId))}
              variant="outline"
              className="group transition-all duration-300 hover:border-primary"
            >
              <Users
                size={18}
                className="mr-2 group-hover:text-primary transition-colors"
              />
              Members
            </Button>

            <SpaceRoleGuard whitelist={[SPACE_ROLE.OWNER]}>
              <Button
                onClick={() => router.push(APP_ROUTES.SPACES.SETTINGS(spaceId))}
                variant="outline"
                className="group transition-all duration-300 hover:border-primary"
              >
                <Settings
                  size={18}
                  className="mr-2 group-hover:text-primary transition-colors"
                />
                Settings
              </Button>
            </SpaceRoleGuard>

            <Button
              className="bg-primary hover:bg-primary/90 flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
              onClick={handleOpenChat}
              disabled={isStartingChat}
            >
              <RobotIcon
                size={18}
                className="transition-transform group-hover:rotate-12"
              />
              {isStartingChat ? "Starting Chat..." : "Open Chat"}
            </Button>
          </div>
        </div>

        <Card className="border border-border/50 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full space-y-4 sm:space-y-0">
                <div className="flex flex-1 max-w-md">
                  <SearchBar onSearch={handleSearch} />
                </div>

                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter size={16} />
                        <span className="hidden sm:inline">File Type</span>
                        <span className="sm:hidden">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Filter by file type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {fileTypeOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setFileTypeFilter(option.value)}
                          className={
                            fileTypeFilter === option.value
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <SpaceRoleGuard
                    whitelist={[SPACE_ROLE.OWNER, SPACE_ROLE.EDITOR]}
                  >
                    <ImportModal spaceId={spaceId}>
                      <Button className="gap-2">
                        <FilePlus2 size={18} />
                        <span className="hidden sm:inline">
                          Upload Documents
                        </span>
                        <span className="sm:hidden">Upload</span>
                      </Button>
                    </ImportModal>
                  </SpaceRoleGuard>
                </div>
              </div>

              <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-4 gap-2">
                  <TabsTrigger value="all" className="flex gap-2">
                    <FileIcon className="h-4 w-4" /> All
                  </TabsTrigger>
                  <TabsTrigger value="ready" className="flex gap-2">
                    <FaCheckCircle className="h-4 w-4 text-green-500" /> Ready
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" /> Processing
                  </TabsTrigger>
                  <TabsTrigger value="queued" className="flex gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" /> Queued
                  </TabsTrigger>
                </TabsList>

                <Separator className="my-6" />

                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    {filteredDocuments.length === 0 ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-12"
                      >
                        <FileIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />

                        {documents.length === 0 ? (
                          <>
                            <p className="text-xl font-medium text-muted-foreground">
                              No documents uploaded yet
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 mb-6">
                              Upload your first document to get started
                            </p>
                            <ImportModal spaceId={spaceId}>
                              <Button className="gap-2">
                                <FilePlus2 size={18} />
                                Upload your first document
                              </Button>
                            </ImportModal>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-medium text-muted-foreground">
                              No matching documents found
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 mb-6">
                              Try adjusting your filters or search query
                            </p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchQuery("");
                                setFileTypeFilter("all");
                                setActiveTab("all");
                              }}
                            >
                              Clear filters
                            </Button>
                          </>
                        )}
                      </motion.div>
                    ) : (
                      <div
                        key="document-list"
                        className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2"
                      >
                        <AnimatePresence>
                          {filteredDocuments.map((document, index) => {
                            const statusInfo = getProcessingStatusInfo(
                              document.processing_status
                            );
                            const fileDate = new Date(document.created_at);
                            const timeAgo = formatDistanceToNow(fileDate, {
                              addSuffix: true,
                            });

                            return (
                              <motion.div
                                key={document.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.05,
                                }}
                              >
                                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group border border-border/50 hover:border-primary/30">
                                  <CardContent className="p-0">
                                    <div className="flex items-stretch">
                                      <div className="flex items-center justify-center p-4 bg-background w-24 border-r border-border/50 group-hover:border-primary/30 transition-colors">
                                        <div className="relative">
                                          {getFileIcon(document.mime_type)}
                                          <div className="absolute -top-2 -right-2 text-xs font-medium bg-background px-1 rounded border border-border/50 text-muted-foreground group-hover:border-primary/30 transition-colors">
                                            {formatFileSize(document.size)}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex-1 p-4">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                              {document.name}
                                            </h3>
                                            {document.description && (
                                              <p className="text-sm text-muted-foreground line-clamp-1">
                                                {document.description}
                                              </p>
                                            )}
                                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                              <Calendar className="h-3.5 w-3.5 mr-1" />
                                              <span>{timeAgo}</span>
                                            </div>
                                          </div>

                                          <div className="flex space-x-1">
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                      handleOpenDocument(
                                                        document
                                                      )
                                                    }
                                                  >
                                                    <Eye size={16} />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>View document</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                            <SpaceRoleGuard
                                              whitelist={[
                                                SPACE_ROLE.OWNER,
                                                SPACE_ROLE.EDITOR,
                                              ]}
                                            >
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger asChild>
                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                      onClick={() =>
                                                        openDeleteDialog(
                                                          document
                                                        )
                                                      }
                                                    >
                                                      <Trash2 size={16} />
                                                    </Button>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p>Delete document</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            </SpaceRoleGuard>
                                          </div>
                                        </div>

                                        <div className="flex items-center mt-3 space-x-2">
                                          <Badge
                                            variant={
                                              document.privacy_status
                                                ? "outline"
                                                : "secondary"
                                            }
                                            className="px-2 py-0.5 text-xs"
                                          >
                                            {document.privacy_status
                                              ? "Private"
                                              : "Public"}
                                          </Badge>

                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Badge
                                                  variant={statusInfo.variant}
                                                  className={`flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity px-2 py-0.5 text-xs ${
                                                    document.processing_status ===
                                                    2
                                                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                                      : document.processing_status ===
                                                        1
                                                      ? "bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                                      : document.processing_status ===
                                                        0
                                                      ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                                                  }`}
                                                  onClick={() =>
                                                    handleProcessingStatusClick(
                                                      document.id
                                                    )
                                                  }
                                                >
                                                  {statusInfo.icon}
                                                  {statusInfo.text}
                                                </Badge>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>
                                                  Click to view processing
                                                  details
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>

                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 rounded-full"
                                                  onClick={() => {}}
                                                >
                                                  <Info size={14} />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent className="max-w-xs">
                                                <p>
                                                  Document ID: {document.id}
                                                </p>
                                                {document.description && (
                                                  <p className="mt-1">
                                                    Description:{" "}
                                                    {document.description}
                                                  </p>
                                                )}
                                                <p className="mt-1">
                                                  MIME Type:{" "}
                                                  {document.mime_type}
                                                </p>
                                                <p>
                                                  Size:{" "}
                                                  {formatFileSize(
                                                    document.size
                                                  )}
                                                </p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>

                                        <div className="mt-3">
                                          <Progress
                                            value={statusInfo.progressValue}
                                            className={`h-1.5 w-full ${statusInfo.progressColor} transition-all duration-500`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <Button
              variant="outline"
              onClick={() => setDocumentPage((prev) => Math.max(prev - 1, 1))}
              disabled={documentPage === 1}
              size="sm"
              className="gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <span className="flex items-center text-sm font-medium">
              Page {documentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setDocumentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={documentPage === totalPages}
              size="sm"
              className="gap-2"
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this document?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                document{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-semibold inline-block max-w-[200px] truncate align-bottom">
                        {documentToDelete?.name}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{documentToDelete?.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>{" "}
                and remove it from the space.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteDocument}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full p-4">
            <DialogHeader className="mb-2">
              <DialogTitle>{documentToView?.name}</DialogTitle>
            </DialogHeader>
            {documentToView && (
              <div className="relative w-full h-[85vh]">
                <iframe
                  src={getDocumentViewerUrl(documentToView)}
                  className="absolute inset-0 w-full h-full border-none"
                  title={documentToView.name}
                />
                <a
                  href={documentToView.s3_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-1 left-1 bg-gray-600 text-white p-2 hover:bg-gray-400 rounded-2xl transition"
                >
                  <Download size={16} />
                </a>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
