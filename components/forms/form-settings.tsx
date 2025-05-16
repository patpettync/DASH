"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface FormSettingsProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

export function FormSettings({ title, description, onTitleChange, onDescriptionChange }: FormSettingsProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [formSettings, setFormSettings] = useState({
    collectEmail: true,
    limitResponses: false,
    responseLimit: "100",
    notifyOnSubmission: true,
    confirmationMessage: "Thank you for your submission!",
    redirectAfterSubmission: false,
    redirectUrl: "",
    theme: "default",
    allowMultipleResponses: false,
    showProgressBar: true,
  })
  const { toast } = useToast()

  const handleSettingChange = (key: string, value: any) => {
    setFormSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = () => {
    // This would typically save to a database
    toast({
      title: "Settings saved",
      description: "Your form settings have been saved successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-title">Form Title</Label>
                <Input id="form-title" value={title} onChange={(e) => onTitleChange(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form-description">Form Description</Label>
                <Textarea
                  id="form-description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Enter a description for your form"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collect-email">Collect Email Addresses</Label>
                  <p className="text-sm text-muted-foreground">Require users to sign in to submit the form</p>
                </div>
                <Switch
                  id="collect-email"
                  checked={formSettings.collectEmail}
                  onCheckedChange={(checked) => handleSettingChange("collectEmail", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="limit-responses">Limit Responses</Label>
                  <p className="text-sm text-muted-foreground">Set a maximum number of responses</p>
                </div>
                <Switch
                  id="limit-responses"
                  checked={formSettings.limitResponses}
                  onCheckedChange={(checked) => handleSettingChange("limitResponses", checked)}
                />
              </div>

              {formSettings.limitResponses && (
                <div className="space-y-2">
                  <Label htmlFor="response-limit">Response Limit</Label>
                  <Input
                    id="response-limit"
                    type="number"
                    value={formSettings.responseLimit}
                    onChange={(e) => handleSettingChange("responseLimit", e.target.value)}
                    min="1"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Response Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-submission">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for new submissions</p>
                </div>
                <Switch
                  id="notify-submission"
                  checked={formSettings.notifyOnSubmission}
                  onCheckedChange={(checked) => handleSettingChange("notifyOnSubmission", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation-message">Confirmation Message</Label>
                <Textarea
                  id="confirmation-message"
                  value={formSettings.confirmationMessage}
                  onChange={(e) => handleSettingChange("confirmationMessage", e.target.value)}
                  placeholder="Thank you for your submission!"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="redirect-submission">Redirect After Submission</Label>
                  <p className="text-sm text-muted-foreground">Redirect to another page after form submission</p>
                </div>
                <Switch
                  id="redirect-submission"
                  checked={formSettings.redirectAfterSubmission}
                  onCheckedChange={(checked) => handleSettingChange("redirectAfterSubmission", checked)}
                />
              </div>

              {formSettings.redirectAfterSubmission && (
                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL</Label>
                  <Input
                    id="redirect-url"
                    type="url"
                    value={formSettings.redirectUrl}
                    onChange={(e) => handleSettingChange("redirectUrl", e.target.value)}
                    placeholder="https://example.com/thank-you"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multiple-responses">Allow Multiple Responses</Label>
                  <p className="text-sm text-muted-foreground">Allow users to submit the form multiple times</p>
                </div>
                <Switch
                  id="multiple-responses"
                  checked={formSettings.allowMultipleResponses}
                  onCheckedChange={(checked) => handleSettingChange("allowMultipleResponses", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-theme">Form Theme</Label>
                <Select value={formSettings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger id="form-theme">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="colorful">Colorful</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="progress-bar">Show Progress Bar</Label>
                  <p className="text-sm text-muted-foreground">Display a progress bar for multi-page forms</p>
                </div>
                <Switch
                  id="progress-bar"
                  checked={formSettings.showProgressBar}
                  onCheckedChange={(checked) => handleSettingChange("showProgressBar", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
