"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserCircle, Edit, Save, X, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { userService } from "@/services/api/user.service";

interface ProfileCardProps {
  user: any;
  setUser: (user: any) => void;
}

export function ProfileCard({ user, setUser }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ id: "", username: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [authMethods, setAuthMethods] = useState<{
    local?: boolean;
    google?: boolean;
  }>({});
  const [loading, setLoading] = useState(false);
  const checkAuthMethod = async () => {
    setLoading(true);
    try {
      const methods = await userService.getAuthMethod();
      setAuthMethods(methods || {});
      setLoading(false);
      return methods || {};
    } catch (error) {
      console.error("Failed to get auth methods", error);
      setLoading(false);
      return {};
    }
  };

  useEffect(() => {
    if (user) {
      checkAuthMethod();
    }
  }, [user]);

  const handleEditClick = () => {
    if (!user) return;
    setFormData({
      id: String(user.id),
      username: user.username,
      email: user.email,
    });
    setIsEditing(true);
    setIsChangingPassword(false);
  };
  const handleChangePasswordClick = async () => {
    if (!user) return;
    if (loading) return;

    if (Object.keys(authMethods).length === 0) {
      const methods = await checkAuthMethod();
      if (!methods || !methods.local) {
        return;
      }
    } else if (!authMethods.local) {
      return;
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const updated = await userService.updateProfile({
        ...formData,
        id: Number(formData.id),
      });
      setUser(updated);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update profile");
    }
  };
  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      await userService.updatePassword({
        id: Number(user.id),
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setIsChangingPassword(false);
      setLoading(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed", error);
      setLoading(false);
      toast.error("Failed to change password");

      if (error instanceof Error) {
        if (error.message.includes("incorrect current password")) {
          toast.error("The current password you entered is incorrect");
        }
      }
    }
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-primary" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-4 border-2 border-primary/30">
                  {formData.username.charAt(0).toUpperCase()}
                </div>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  placeholder="Username"
                  className="mb-2"
                />
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Email"
                  disabled
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={handleSave} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : isChangingPassword ? (
            <motion.div
              key="changing-password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold mb-4 border-2 border-primary/30">
                  <Key className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              </div>

              {!authMethods || !authMethods.local ? (
                <div className="text-center">
                  <p className="text-amber-600 mb-4">
                    Password change is not available for accounts that use
                    Google or other external login methods.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSavePassword();
                  }}
                >
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      required
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      required
                      minLength={6}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="New password"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      required
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>{" "}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin">◌</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Password
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsChangingPassword(false)}
                      disabled={loading}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="viewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <Button className="w-full" onClick={handleEditClick}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>{" "}
                {!loading &&
                Object.keys(authMethods).length > 0 &&
                !authMethods.local ? (
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full opacity-60"
                      disabled={true}
                      title="Password change not available for accounts using Google or other external login methods"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <div className="text-xs text-muted-foreground mt-1 text-center">
                      Not available for Google accounts
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleChangePasswordClick}
                    disabled={loading}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    {loading ? "Checking..." : "Change Password"}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
