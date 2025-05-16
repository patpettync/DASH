"use client"

import { useState } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Plus, Clock, Star, BarChart2, Inbox, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample sidebar sections for the Forms module
const formsSidebarSections = [
  {
    title: "Forms",
    links: [
      { href: "/forms", label: "All Forms", icon: <FileText className="h-5 w-5" /> },
      { href: "/forms/create", label: "Create New", icon: <Plus className="h-5 w-5" /> },
      { href: "/forms/recent", label: "Recent", icon: <Clock className="h-5 w-5" /> },
      { href: "/forms/favorites", label: "Favorites", icon: <Star className="h-5 w-5" /> },
    ],
  },
  {
    title: "Responses",
    links: [
      { href: "/forms/responses", label: "All Responses", icon: <Inbox className="h-5 w-5" /> },
      { href: "/forms/analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5" /> },
    ],
  },
  {
    title: "Templates",
    links: [{ href: "/forms/templates", label: "Form Templates", icon: <FileText className="h-5 w-5" /> }],
  },
]

// Sample form response data
const formResponses = [
  {
    id: 1,
    formName: "Customer Feedback Form",
    respondent: "john.doe@example.com",
    submittedAt: "2023-05-15T10:30:00Z",
    status: "complete",
  },
  {
    id: 2,
    formName: "Customer Feedback Form",
    respondent: "jane.smith@example.com",
    submittedAt: "2023-05-14T14:45:00Z",
    status: "complete",
  },
  {
    id: 3,
    formName: "Event Registration",
    respondent: "mike.johnson@example.com",
    submittedAt: "2023-05-13T09:15:00Z",
    status: "complete",
  },
  {
    id: 4,
    formName: "Event Registration",
    respondent: "sarah.williams@example.com",
    submittedAt: "2023-05-12T16:20:00Z",
    status: "partial",
  },
  {
    id: 5,
    formName: "Job Application",
    respondent: "robert.brown@example.com",
    submittedAt: "2023-05-11T11:10:00Z",
    status: "complete",
  },
  {
    id: 6,
    formName: "Job Application",
    respondent: "emily.davis@example.com",
    submittedAt: "2023-05-10T13:25:00Z",
    status: "complete",
  },
  {
    id: 7,
    formName: "Customer Feedback Form",
    respondent: "david.wilson@example.com",
    submittedAt: "2023-05-09T15:40:00Z",
    status: "partial",
  },
  {
    id: 8,
    formName: "Event Registration",
    respondent: "lisa.taylor@example.com",
    submittedAt: "2023-05-08T10:05:00Z",
    status: "complete",
  },
]

// Sample form summary data
const formSummary = [
  {
    formName: "Customer Feedback Form",
    responseCount: 3,
    completionRate: "67%",
    averageTime: "2m 45s",
  },
  {
    formName: "Event Registration",
    responseCount: 3,
    completionRate: "67%",
    averageTime: "3m 20s",
  },
  {
    formName: "Job Application",
    responseCount: 2,
    completionRate: "100%",
    averageTime: "5m 15s",
  },
]

export default function FormResponsesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter responses based on search query and active tab
  const filteredResponses = formResponses.filter((response) => {
    const matchesSearch =
      response.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.respondent.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && response.formName.toLowerCase().includes(activeTab.toLowerCase())
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <ModuleLayout moduleName="Forms" sidebarSections={formsSidebarSections}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Form Responses</h1>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Responses</DropdownMenuItem>
                <DropdownMenuItem>Complete Only</DropdownMenuItem>
                <DropdownMenuItem>Partial Only</DropdownMenuItem>
                <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search responses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Forms</TabsTrigger>
            <TabsTrigger value="Customer Feedback">Customer Feedback</TabsTrigger>
            <TabsTrigger value="Event Registration">Event Registration</TabsTrigger>
            <TabsTrigger value="Job Application">Job Application</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Responses</CardTitle>
                <CardDescription>{filteredResponses.length} responses found</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form</TableHead>
                      <TableHead>Respondent</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="font-medium">{response.formName}</TableCell>
                        <TableCell>{response.respondent}</TableCell>
                        <TableCell>{formatDate(response.submittedAt)}</TableCell>
                        <TableCell>
                          <Badge variant={response.status === "complete" ? "default" : "outline"}>
                            {response.status === "complete" ? "Complete" : "Partial"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/forms/responses/${response.id}`}>View</a>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formSummary.map((summary, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{summary.formName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Responses</span>
                    <span className="font-medium">{summary.responseCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{summary.completionRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Time</span>
                    <span className="font-medium">{summary.averageTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ModuleLayout>
  )
}
