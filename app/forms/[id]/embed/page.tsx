"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { FileText, Plus, BarChart2, ArrowLeft, Copy, Code, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"

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

export default function FormEmbedPage() {
  const params = useParams()
  const formId = params.id
  const { toast } = useToast()

  // This would typically come from an API call
  const formName = "Customer Feedback Form"

  const [embedSettings, setEmbedSettings] = useState({
    theme: "light",
    autoResize: true,
    hideTitle: false,
    hideFooter: false,
    width: 100, // percentage
    height: 500, // pixels
  })

  const [embedCode, setEmbedCode] = useState(`<iframe 
  src="https://forms.example.com/embed/${formId}" 
  width="100%" 
  height="500px" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0">
  Loading...
</iframe>`)

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = {
      ...embedSettings,
      [key]: value,
    }

    setEmbedSettings(newSettings)

    // Update embed code based on new settings
    const width = newSettings.width === 100 ? "100%" : `${newSettings.width}px`
    const updatedEmbedCode = `<iframe 
  src="https://forms.example.com/embed/${formId}?theme=${newSettings.theme}&autoResize=${newSettings.autoResize}&hideTitle=${newSettings.hideTitle}&hideFooter=${newSettings.hideFooter}" 
  width="${width}" 
  height="${newSettings.height}px" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0">
  Loading...
</iframe>`

    setEmbedCode(updatedEmbedCode)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode)
    toast({
      title: "Code copied",
      description: "Embed code has been copied to clipboard.",
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
          <h1 className="text-2xl font-bold">{formName} - Embed</h1>
        </div>

        <Tabs defaultValue="iframe">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="iframe">Embed Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Embed Settings</CardTitle>
                <CardDescription>Customize how your form appears when embedded</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={embedSettings.theme}
                        onValueChange={(value) => handleSettingChange("theme", value)}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto (System)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="width"
                          min={20}
                          max={100}
                          step={1}
                          value={[embedSettings.width]}
                          onValueChange={(value) => handleSettingChange("width", value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{embedSettings.width}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="height"
                          min={200}
                          max={1000}
                          step={10}
                          value={[embedSettings.height]}
                          onValueChange={(value) => handleSettingChange("height", value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{embedSettings.height}px</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-resize">Auto Resize</Label>
                        <p className="text-sm text-muted-foreground">Automatically adjust height based on content</p>
                      </div>
                      <Switch
                        id="auto-resize"
                        checked={embedSettings.autoResize}
                        onCheckedChange={(checked) => handleSettingChange("autoResize", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-title">Hide Title</Label>
                        <p className="text-sm text-muted-foreground">Hide the form title in the embedded view</p>
                      </div>
                      <Switch
                        id="hide-title"
                        checked={embedSettings.hideTitle}
                        onCheckedChange={(checked) => handleSettingChange("hideTitle", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hide-footer">Hide Footer</Label>
                        <p className="text-sm text-muted-foreground">Hide the form footer in the embedded view</p>
                      </div>
                      <Switch
                        id="hide-footer"
                        checked={embedSettings.hideFooter}
                        onCheckedChange={(checked) => handleSettingChange("hideFooter", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
                <CardDescription>Copy and paste this code into your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea value={embedCode} readOnly rows={6} className="font-mono text-sm" />
                  <Button className="absolute top-2 right-2" size="sm" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="ml-auto">
                  <Link href={`https://forms.example.com/embed/${formId}`} target="_blank">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Embed Preview</CardTitle>
                <CardDescription>Preview how your form will appear when embedded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Embedded Form Preview</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      A live preview of your embedded form would appear here.
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link href={`https://forms.example.com/embed/${formId}`} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Preview in New Tab
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Guide</CardTitle>
                <CardDescription>Learn how to embed this form in different platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">HTML Website</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Copy the embed code and paste it directly into your HTML where you want the form to appear.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">WordPress</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a Custom HTML block in your WordPress editor and paste the embed code.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Shopify</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add a Custom HTML section to your Shopify page and paste the embed code.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For emails, use a link to the form instead of embedding it directly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  )
}
