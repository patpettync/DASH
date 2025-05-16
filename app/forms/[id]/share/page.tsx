"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Plus, BarChart2, ArrowLeft, Copy, Mail, Globe, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Simplified sidebar sections for the Forms module
const formsSidebarSections = [
  {
    title: "Forms",
    links: [
      { href: "/forms", label: "All Forms", icon: <FileText className="h-5 w-5" /> },
      { href: "/forms/create", label: "Create New", icon: <Plus className="h-5 w-5" /> },
    ],
  },
  {
    title: "Analytics",
    links: [{ href: "/forms/analytics", label: "Form Analytics", icon: <BarChart2 className="h-5 w-5" /> }],
  },
]

// Sample collaborators data
const sampleCollaborators = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    avatar: "/javascript-code.png",
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "viewer",
    avatar: "/abstract-geometric-mj.png",
  },
  {
    id: 3,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "viewer",
    avatar: "/stylized-sw.png",
  },
]

export default function FormSharePage() {
  const params = useParams()
  const formId = params.id
  const { toast } = useToast()

  // This would typically come from an API call
  const formName = "Customer Feedback Form"

  const [shareSettings, setShareSettings] = useState({
    accessType: "restricted", // restricted, anyone, domain
    requireLogin: true,
    allowEditing: false,
    expirationEnabled: false,
    expirationDate: "",
    notifyOnSubmission: true,
  })

  const [shareLink, setShareLink] = useState(`https://forms.example.com/f/${formId}`)
  const [emailInput, setEmailInput] = useState("")
  const [roleInput, setRoleInput] = useState("viewer")

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard.",
    })
  }

  const handleSettingChange = (key: string, value: any) => {
    setShareSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleInviteUser = () => {
    if (!emailInput.trim()) return

    // In a real app, this would make an API call to invite the user
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${emailInput}.`,
    })

    setEmailInput("")
  }

  const handleRemoveCollaborator = (id: number) => {
    // In a real app, this would make an API call to remove the collaborator
    toast({
      title: "Collaborator removed",
      description: "The collaborator has been removed successfully.",
    })
  }

  const handleChangeRole = (id: number, role: string) => {
    // In a real app, this would make an API call to change the collaborator's role
    toast({
      title: "Role updated",
      description: "The collaborator's role has been updated successfully.",
    })
  }

  return (
    <ModuleLayout moduleName="Forms" sidebarSections={formsSidebarSections}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/forms/${formId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{formName} - Share</h1>
        </div>

        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Form</CardTitle>
                <CardDescription>Create a link to share your form with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2">
                  <Input value={shareLink} readOnly className="flex-1" />
                  <Button onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Access Settings</h3>
                    <p className="text-sm text-muted-foreground">Control who can access and submit your form</p>
                  </div>

                  <RadioGroup
                    value={shareSettings.accessType}
                    onValueChange={(value) => handleSettingChange("accessType", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="restricted" id="restricted" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="restricted" className="font-medium">
                          Restricted
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Only specific people you invite can access the form
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="anyone" id="anyone" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="anyone" className="font-medium">
                          Anyone with the link
                        </Label>
                        <p className="text-sm text-muted-foreground">Anyone who has the link can access the form</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="domain" id="domain" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="domain" className="font-medium">
                          Anyone in your organization
                        </Label>
                        <p className="text-sm text-muted-foreground">Anyone in your organization can access the form</p>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="require-login">Require Login</Label>
                        <p className="text-sm text-muted-foreground">Require users to sign in to access the form</p>
                      </div>
                      <Switch
                        id="require-login"
                        checked={shareSettings.requireLogin}
                        onCheckedChange={(checked) => handleSettingChange("requireLogin", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-editing">Allow Editing</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to edit their responses after submission
                        </p>
                      </div>
                      <Switch
                        id="allow-editing"
                        checked={shareSettings.allowEditing}
                        onCheckedChange={(checked) => handleSettingChange("allowEditing", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="expiration-enabled">Set Expiration Date</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically close the form after a specific date
                        </p>
                      </div>
                      <Switch
                        id="expiration-enabled"
                        checked={shareSettings.expirationEnabled}
                        onCheckedChange={(checked) => handleSettingChange("expirationEnabled", checked)}
                      />
                    </div>

                    {shareSettings.expirationEnabled && (
                      <div className="space-y-2">
                        <Label htmlFor="expiration-date">Expiration Date</Label>
                        <Input
                          id="expiration-date"
                          type="date"
                          value={shareSettings.expirationDate}
                          onChange={(e) => handleSettingChange("expirationDate", e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-submission">Notify on Submission</Label>
                        <p className="text-sm text-muted-foreground">Receive email notifications for new submissions</p>
                      </div>
                      <Switch
                        id="notify-submission"
                        checked={shareSettings.notifyOnSubmission}
                        onCheckedChange={(checked) => handleSettingChange("notifyOnSubmission", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  {shareSettings.accessType === "restricted" ? (
                    <>
                      <Lock className="mr-1 h-4 w-4" />
                      Restricted Access
                    </>
                  ) : shareSettings.accessType === "domain" ? (
                    <>
                      <Users className="mr-1 h-4 w-4" />
                      Organization Access
                    </>
                  ) : (
                    <>
                      <Globe className="mr-1 h-4 w-4" />
                      Public Access
                    </>
                  )}
                </div>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share via Email</CardTitle>
                <CardDescription>Send a direct link to specific email addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleInviteUser}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Collaborators</CardTitle>
                <CardDescription>Add or remove people who can edit or view this form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={roleInput} onValueChange={setRoleInput}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInviteUser}>Invite</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src="/stylized-jd-initials.png" alt="John Doe" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p>John Doe (You)</p>
                            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge>Owner</Badge>
                      </TableCell>
                      <TableCell className="text-right">{/* No actions for owner */}</TableCell>
                    </TableRow>

                    {sampleCollaborators.map((collaborator) => (
                      <TableRow key={collaborator.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                              <AvatarFallback>
                                {collaborator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p>{collaborator.name}</p>
                              <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={collaborator.role}
                            onValueChange={(value) => handleChangeRole(collaborator.id, value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveCollaborator(collaborator.id)}>
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  )
}
