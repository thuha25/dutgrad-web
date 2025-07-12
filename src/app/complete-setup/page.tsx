"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth.context"
import { toast } from "sonner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { usernameUpdateSchema, type UsernameUpdateCredentials } from "@/schemas/auth"
import { userService } from "@/services/api/user.service"
import { APP_ROUTES } from "@/lib/constants"
import { MFASetup } from "./components/mfa-setup"
import { LockKeyhole, User, ArrowRight, Shield } from "lucide-react"

export default function CompleteSetupPage() {
  const { user, setUser } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("username")
  const router = useRouter()

  const usernameForm = useForm<UsernameUpdateCredentials>({
    resolver: zodResolver(usernameUpdateSchema),
    defaultValues: {
      username: user?.username || "",
    },
  })

  useEffect(() => {
    if (user?.username) {
      usernameForm.setValue("username", user.username)
    }
  }, [user])

  async function onUsernameSubmit(data: UsernameUpdateCredentials) {
    try {
      if (!user) return

      const updated = await userService.updateProfile({
        ...user,
        username: data.username,
      })

      setUser(updated)
      toast.success("Username updated successfully")

      setActiveTab("mfa")
    } catch (error) {
      console.error("Failed to update username:", error)
      toast.error("Failed to update username. Please try again.")
    }
  }

  const handleMfaSuccess = () => {
    toast.success("MFA setup completed successfully!")
    router.push(APP_ROUTES.DASHBOARD)
  }

  const handleMfaSkip = () => {
    router.push(APP_ROUTES.DASHBOARD)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <Card className="w-full max-w-md shadow-lg border border-border/40">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-primary animate-pulse" />
              Loading...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border border-border/40 overflow-hidden">
        <CardHeader className="pb-1 pt-4 px-5">
          <CardTitle className="text-xl font-bold text-center">Complete Your Account Setup</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-sm">
            Just a few more steps to secure your account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none bg-muted/50 p-0 h-12 mt-2">
              <TabsTrigger
                value="username"
                className="rounded-none data-[state=active]:bg-background py-2 h-full flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <User className="h-3.5 w-3.5" />
                <span>Username</span>
              </TabsTrigger>
              <TabsTrigger
                value="mfa"
                className="rounded-none data-[state=active]:bg-background py-2 h-full flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <LockKeyhole className="h-3.5 w-3.5" />
                <span>Two-Factor Auth</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-5">
              <TabsContent value="username" className="mt-0 space-y-3 min-h-[260px] animate-in fade-in-50 duration-300">
                <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                  <div className="flex gap-2.5">
                    <User className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Personalize Your Profile</h3>
                      <p className="text-xs text-muted-foreground">Choose a username for your profile.</p>
                    </div>
                  </div>
                </div>

                <Form {...usernameForm}>
                  <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4 mt-4">
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" className="h-10" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs">This will be displayed to other users.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" className="gap-1.5 px-4 h-9">
                        Continue
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="mfa" className="mt-0 min-h-[260px] animate-in fade-in-50 duration-300">
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                    <div className="flex gap-2.5">
                      <LockKeyhole className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">Two-Factor Authentication</h3>
                        <p className="text-xs text-muted-foreground">
                          Add an extra security layer with an authenticator app like Google Authenticator.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-4">
                    <Shield className="h-12 w-12 text-primary/20 mb-3" />
                    <p className="text-center text-xs text-muted-foreground max-w-xs mx-auto mb-4">
                      Protect your account with a verification code from your mobile device.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleMfaSkip} className="border-border/50 h-9 text-sm">
                      Skip for now
                    </Button>
                    <Button onClick={() => setActiveTab("mfa-setup")} className="gap-1.5 h-9 text-sm">
                      Set up MFA
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mfa-setup" className="mt-0 min-h-[260px] animate-in fade-in-50 duration-300">
                <MFASetup onSuccess={handleMfaSuccess} onSkip={() => setActiveTab("mfa")} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
