"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { spaceService } from "@/services/api/space.service";
import ApiDocument from "./ApiDocument";

interface ApiKey {
  id: string;
  name: string;
  description: string;
  token?: string;
  created_at: string;
}

export function ChatApi({ spaceId }: { spaceId: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });
  const [currentHost, setCurrentHost] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.origin);
    }
    fetchApiKeys();
  }, [spaceId]);

  const fetchApiKeys = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await spaceService.getApiKeys(spaceId);
      setApiKeys(data.API);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
      setError("Failed to load API keys. Please try again later.");
      toast.error("Failed to load API keys", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowToken = async (keyId: string) => {
    if (!showTokens[keyId] && !apiKeys.find((k) => k.id === keyId)?.token) {
      try {
        const data = await spaceService.getApiKey(spaceId, keyId);
        setApiKeys((prev) =>
          prev.map((key) =>
            key.id === keyId ? { ...key, token: data.API.token } : key
          )
        );
        setShowTokens((prev) => ({
          ...prev,
          [keyId]: true,
        }));
      } catch (err) {
        toast.error("Failed to load API key token", {
          description: "Please try again later",
        });
      }
    } else {
      setShowTokens((prev) => ({
        ...prev,
        [keyId]: !prev[keyId],
      }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard", {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    });
  };

  const validateForm = () => {
    const errors = {
      name: "",
      description: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length > 50) {
      errors.name = "Name must be less than 50 characters";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length > 200) {
      errors.description = "Description must be less than 200 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateApiKey = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      const data = await spaceService.createApiKey(spaceId, {
        name: formData.name,
        description: formData.description,
      });

      setNewApiKey(data);
      await fetchApiKeys();

      setFormData({ name: "", description: "" });
    } catch (err) {
      toast.error("Failed to create API key", {
        description: "Please try again later",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    setIsDeleting((prev) => ({ ...prev, [keyId]: true }));
    try {
      await spaceService.deleteApiKey(spaceId, keyId);
      setApiKeys((prev) => prev.filter((key) => key.id !== keyId));
      toast.success("API key deleted successfully");
    } catch (err) {
      toast.error("Failed to delete API key", {
        description: "Please try again later",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [keyId]: false }));
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewApiKey(null);
    setFormData({ name: "", description: "" });
    setFormErrors({ name: "", description: "" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const formatTokenForDisplay = (token: string) => {
    if (!token) return "";
    if (token.length <= 40) return token;
    return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <ApiDocument spaceId={spaceId} />

      <Card className="overflow-hidden backdrop-blur-sm bg-card/80 shadow-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {newApiKey ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-primary">
                        <Key size={18} />
                        API Key Created
                      </DialogTitle>
                      <DialogDescription>
                        {
                          "Your new API key has been created. Please copy it now as you won't be able to see it again."
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4 p-3 bg-muted/50 rounded-md border">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">
                            API Key Token
                          </Label>
                          <Button
                            variant={tokenCopied ? "outline" : "ghost"}
                            size="sm"
                            className={`h-8 px-2 ${
                              tokenCopied
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : ""
                            }`}
                            onClick={() =>
                              copyToClipboard(newApiKey.token || "")
                            }
                          >
                            {tokenCopied ? (
                              <CheckCircle2 size={14} className="mr-1" />
                            ) : (
                              <Copy size={14} className="mr-1" />
                            )}
                            {tokenCopied ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <div className="relative">
                          <div className="font-mono text-xs bg-background p-3 rounded border break-all max-h-[120px] overflow-y-auto">
                            {newApiKey.token}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Name</Label>
                          <div className="text-sm mt-1">{newApiKey.name}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">
                            Description
                          </Label>
                          <div className="text-sm mt-1">
                            {newApiKey.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mr-auto">
                        <Info size={14} />
                        Store this key securely
                      </div>
                      <Button onClick={closeCreateModal}>Done</Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Key size={18} />
                        Create New API Key
                      </DialogTitle>
                      <DialogDescription>
                        Create an API key to access this space programmatically.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="name" className="text-sm font-medium">
                            Name
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {formData.name.length}/50
                          </span>
                        </div>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (e.target.value.trim())
                              setFormErrors({ ...formErrors, name: "" });
                          }}
                          placeholder="Enter a name for this API key"
                          className={
                            formErrors.name ? "border-destructive" : ""
                          }
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertTriangle size={14} />
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="description"
                            className="text-sm font-medium"
                          >
                            Description
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {formData.description.length}/200
                          </span>
                        </div>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            });
                            if (e.target.value.trim())
                              setFormErrors({ ...formErrors, description: "" });
                          }}
                          placeholder="What is this API key for?"
                          rows={3}
                          className={
                            formErrors.description ? "border-destructive" : ""
                          }
                        />
                        {formErrors.description && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertTriangle size={14} />
                            {formErrors.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={closeCreateModal}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateApiKey}
                        disabled={isCreating}
                        className="gap-2"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Key size={16} />
                            Create API Key
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Manage API keys for programmatic access to this space
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive mb-2" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchApiKeys}>
                Try Again
              </Button>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted/30 rounded-full p-3 mb-3">
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No API Keys</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                {
                  "You haven't created any API keys yet. Create one to access this space programmatically."
                }
              </p>
              <Button
                variant={"outline"}
                disabled
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create your API Key now
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {key.description}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-xs bg-muted/30 p-1.5 rounded max-w-[180px] truncate">
                            {showTokens[key.id]
                              ? formatTokenForDisplay(key.token || "")
                              : "••••••••••••••••••••••"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleShowToken(key.id)}
                          >
                            {showTokens[key.id] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                            <span className="sr-only">
                              {showTokens[key.id] ? "Hide" : "Show"}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => copyToClipboard(key.token || "")}
                          >
                            <Copy size={14} />
                            <span className="sr-only">Copy</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 size={14} />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Delete API Key
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApiKey(key.id)}
                                className="bg-destructive hover:bg-destructive/90 gap-2"
                              >
                                {isDeleting[key.id] ? (
                                  <>
                                    <Loader2
                                      size={16}
                                      className="animate-spin"
                                    />
                                    Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 size={16} />
                                    Delete
                                  </>
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={14} />
            <span>
              API keys provide full access to your space. Keep them secure!
            </span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
