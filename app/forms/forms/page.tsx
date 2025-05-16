"use client"

import { useState } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Share2, Code, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TabItem } from "@/components/layouts/module-tabs"
import { useTabTransition } from "@/hooks/use-tab-transition"
import { FormsTabContent } from "@/components/layouts/forms-tab-content"
import { useRouter } from "next/navigation"

// Define module tabs for the Forms module
const formsTabs: TabItem[] = [
  { href: "/forms/forms", label: "FORMS", exact: true },
  { href: "/forms/field-sets", label: "FIELD SETS" },
]

// Sample form data
const sampleForms = [
  {
    id: 1,
    name: "Customer Feedback Form",
    status: "published",
    responses: 24,
    created: "2023-05-10T14:30:00Z",
    lastUpdated: "2023-05-15T09:45:00Z",
    versions: 3,
    shared: true,
    archived: false,
  },
  {
    id: 2,
    name: "Event Registration",
    status: "published",
    responses: 156,
    created: "2023-04-22T11:20:00Z",
    lastUpdated: "2023-05-12T16:30:00Z",
    versions: 5,
    shared: true,
    archived: false,
  },
  {
    id: 3,
    name: "Job Application",
    status: "published",
    responses: 42,
    created: "2023-05-05T10:15:00Z",
    lastUpdated: "2023-05-14T13:10:00Z",
    versions: 2,
    shared: false,
    archived: false,
  },
  {
    id: 4,
    name: "Product Survey",
    status: "draft",
    responses: 0,
    created: "2023-05-16T09:00:00Z",
    lastUpdated: "2023-05-16T09:00:00Z",
    versions: 1,
    shared: false,
    archived: false,
  },
  {
    id: 5,
    name: "Conference Feedback",
    status: "archived",
    responses: 89,
    created: "2023-03-15T08:45:00Z",
    lastUpdated: "2023-04-01T11:30:00Z",
    versions: 4,
    shared: true,
    archived: true,
  },
  {
    id: 6,
    name: "Employee Satisfaction Survey",
    status: "archived",
    responses: 67,
    created: "2023-02-10T10:30:00Z",
    lastUpdated: "2023-03-15T14:20:00Z",
    versions: 3,
    shared: false,
    archived: true,
  },
  {
    id: 7,
    name: "Website Feedback Form",
    status: "archived",
    responses: 112,
    created: "2023-01-05T09:15:00Z",
    lastUpdated: "2023-02-20T11:45:00Z",
    versions: 6,
    shared: true,
    archived: true,
  },
]

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const { previousActive, isTransitioning } = useTabTransition(activeTab)
  const { toast } = useToast()
  const router = useRouter()

  // Filter forms based on search query and active/archived status
  const filteredForms = sampleForms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "active" ? !form.archived : form.archived),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleDuplicateForm = (formId: number) => {
    toast({
      title: "Form duplicated",
      description: "The form has been duplicated successfully.",
    })
  }

  const handleArchiveForm = (formId: number) => {
    toast({
      title: "Form archived",
      description: "The form has been archived successfully.",
    })
  }

  const handleDeleteForm = (formId: number) => {
    toast({
      title: "Form deleted",
      description: "The form has been deleted successfully.",
    })
  }

  return (
    <ModuleLayout moduleName="Forms" tabs={formsTabs} basePath="/forms">
      <FormsTabContent activeTab={activeTab} previousTab={previousActive}>
        <div className="space-y-6">
          {/* Header section with search and filters aligned horizontally */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{activeTab === "active" ? "Active Forms" : "Archived Forms"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Versions</TableHead>
                    <TableHead>Shared</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForms.length > 0 ? (
                    filteredForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell className="font-medium">
                          <Link href={`/forms/forms/${form.id}`} className="hover:underline">
                            {form.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              form.status === "published"
                                ? "default"
                                : form.status === "draft"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{form.responses}</TableCell>
                        <TableCell>{formatDate(form.created)}</TableCell>
                        <TableCell>{formatDate(form.lastUpdated)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <History className="mr-1 h-4 w-4" />
                            {form.versions}
                          </div>
                        </TableCell>
                        <TableCell>
                          {form.shared ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Shared
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              Private
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Code className="mr-2 h-4 w-4" />
                                Embed
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <History className="mr-2 h-4 w-4" />
                                Versions
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateForm(form.id)}>
                                Duplicate
                              </DropdownMenuItem>
                              {activeTab === "active" ? (
                                <DropdownMenuItem onClick={() => handleArchiveForm(form.id)}>Archive</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleArchiveForm(form.id)}>Restore</DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteForm(form.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        {searchQuery ? (
                          <>No forms found matching "{searchQuery}"</>
                        ) : (
                          <>No {activeTab === "active" ? "active" : "archived"} forms found</>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </FormsTabContent>
    </ModuleLayout>
  )
}
