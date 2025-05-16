"use client"

import { useState, useEffect, useRef } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowLeft,
  BarChart2,
  LineChart,
  Download,
  Clock,
  Users,
  Eye,
  Trash,
  CheckCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabContent } from "@/components/layouts/tab-content"
import type { TabItem } from "@/components/layouts/module-tabs"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { FormVersions } from "@/components/forms/form-versions"

// Define module tabs for the Forms module
const formsTabs: TabItem[] = [
  { href: "/forms/forms", label: "FORMS", exact: true },
  { href: "/forms/field-sets", label: "FIELD SETS" },
]

// Sample form data
const sampleForms = [
  {
    id: "1",
    name: "Customer Feedback Form",
    responses: 245,
    completionRate: 78,
    avgTimeToComplete: "3:24",
    dailyResponses: [12, 15, 8, 21, 18, 25, 19],
    questionCompletion: [
      { question: "How satisfied are you with our service?", completion: 98 },
      { question: "Would you recommend us to others?", completion: 95 },
      { question: "What improvements would you suggest?", completion: 72 },
      { question: "How long have you been our customer?", completion: 89 },
      { question: "Any additional comments?", completion: 45 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 15 },
        { group: "25-34", percentage: 32 },
        { group: "35-44", percentage: 28 },
        { group: "45-54", percentage: 18 },
        { group: "55+", percentage: 7 },
      ],
      device: [
        { type: "Mobile", percentage: 64 },
        { type: "Desktop", percentage: 31 },
        { type: "Tablet", percentage: 5 },
      ],
    },
    versions: [
      {
        id: "v3",
        name: "Version 3",
        date: "2025-05-01",
        status: "active",
        changes: "Added new question about customer service",
      },
      {
        id: "v2",
        name: "Version 2",
        date: "2025-04-15",
        status: "archived",
        changes: "Updated rating scale and fixed typos",
      },
      { id: "v1", name: "Version 1", date: "2025-04-01", status: "archived", changes: "Initial release" },
    ],
    formResponses: [
      {
        id: "r1",
        submittedAt: "2025-05-15T14:30:00",
        status: "complete",
        respondent: "john.doe@example.com",
        duration: "2:45",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Very satisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Yes, definitely", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer:
              "I would like to see more customization options for the dashboard. The current interface is good but could be more flexible for power users. It would also be helpful to have more export options for reports and data analysis.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "1-3 years", type: "select" },
          {
            question: "Any additional comments?",
            answer:
              "Great service overall, keep up the good work! I've been impressed with the customer support team's responsiveness and knowledge. They've helped me solve several complex issues quickly.",
            type: "textarea",
          },
          {
            question: "Which features do you use most frequently?",
            answer: "Reporting, User Management, Analytics",
            type: "checkbox",
          },
          { question: "How often do you use our platform?", answer: "Daily", type: "radio" },
          { question: "What is your role in your organization?", answer: "Manager", type: "select" },
          { question: "Would you be interested in beta testing new features?", answer: "Yes", type: "radio" },
          { question: "How did you hear about our service?", answer: "Colleague recommendation", type: "select" },
          { question: "What industry are you in?", answer: "Technology", type: "select" },
          { question: "What is your company size?", answer: "50-200 employees", type: "select" },
        ],
      },
      {
        id: "r2",
        submittedAt: "2025-05-15T12:15:00",
        status: "complete",
        respondent: "sarah.smith@example.com",
        duration: "3:12",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Satisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Probably", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer: "The mobile app could use some improvements. Sometimes it's slow to load.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "Less than a year", type: "select" },
          { question: "Any additional comments?", answer: "", type: "textarea" },
        ],
      },
      {
        id: "r3",
        submittedAt: "2025-05-14T18:45:00",
        status: "partial",
        respondent: "mike.johnson@example.com",
        duration: "1:30",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Neutral", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Maybe", type: "radio" },
          { question: "What improvements would you suggest?", answer: "", type: "textarea" },
          { question: "How long have you been our customer?", answer: "3-5 years", type: "select" },
          { question: "Any additional comments?", answer: "", type: "textarea" },
        ],
      },
      {
        id: "r4",
        submittedAt: "2025-05-14T10:20:00",
        status: "complete",
        respondent: "lisa.brown@example.com",
        duration: "4:05",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Very satisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Yes, definitely", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer: "I think the pricing could be more transparent. Otherwise, everything is great.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "More than 5 years", type: "select" },
          {
            question: "Any additional comments?",
            answer: "I've been with your company for years and have always appreciated the customer service.",
            type: "textarea",
          },
        ],
      },
      {
        id: "r5",
        submittedAt: "2025-05-13T16:55:00",
        status: "complete",
        respondent: "david.wilson@example.com",
        duration: "2:50",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Dissatisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Probably not", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer: "Customer support response times need to be improved. I waited 2 days for a response to my ticket.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "1-3 years", type: "select" },
          {
            question: "Any additional comments?",
            answer: "I'm considering switching to a competitor due to the support issues.",
            type: "textarea",
          },
        ],
      },
      {
        id: "r6",
        submittedAt: "2025-05-13T09:10:00",
        status: "error",
        respondent: "emma.taylor@example.com",
        duration: "0:45",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Satisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "", type: "radio" },
          { question: "What improvements would you suggest?", answer: "", type: "textarea" },
          { question: "How long have you been our customer?", answer: "", type: "select" },
          { question: "Any additional comments?", answer: "", type: "textarea" },
        ],
      },
      {
        id: "r7",
        submittedAt: "2025-05-12T15:30:00",
        status: "complete",
        respondent: "james.anderson@example.com",
        duration: "3:20",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Very satisfied", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Yes, definitely", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer: "More integration options with other software would be helpful.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "Less than a year", type: "select" },
          {
            question: "Any additional comments?",
            answer: "So far so good! Looking forward to seeing how the product evolves.",
            type: "textarea",
          },
        ],
      },
      {
        id: "r8",
        submittedAt: "2025-05-12T11:25:00",
        status: "partial",
        respondent: "olivia.martin@example.com",
        duration: "1:15",
        answers: [
          { question: "How satisfied are you with our service?", answer: "Neutral", type: "radio" },
          { question: "Would you recommend us to others?", answer: "Maybe", type: "radio" },
          {
            question: "What improvements would you suggest?",
            answer: "The UI could be more intuitive.",
            type: "textarea",
          },
          { question: "How long have you been our customer?", answer: "", type: "select" },
          { question: "Any additional comments?", answer: "", type: "textarea" },
        ],
      },
    ],
    settings: {
      general: {
        formName: "Customer Feedback Form",
        description: "Help us improve our service by providing your feedback",
        isActive: true,
        collectEmailAddresses: true,
        allowAnonymousSubmissions: false,
        enableCaptcha: true,
        submissionLimit: "unlimited",
      },
      notifications: {
        notifyOnSubmission: true,
        notificationEmails: "admin@example.com, support@example.com",
        sendConfirmationEmail: true,
        confirmationEmailTemplate: "default",
      },
      access: {
        accessType: "public",
        requireLogin: false,
        allowedDomains: "",
        expirationDate: "",
      },
    },
  },
  // Other sample forms...
]

export default function FormDetailsPage() {
  const params = useParams()
  const formId = params.id as string
  const [timeRange, setTimeRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoaded, setIsLoaded] = useState(false)
  const [responseFilter, setResponseFilter] = useState("all")
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [responseDetailsOpen, setResponseDetailsOpen] = useState(false)

  // Track component mounted state to prevent state updates after unmounting
  const isMounted = useRef(true)

  // Track open dropdown to ensure it's closed properly
  const [openDropdownId, setOpenDropdownId] = useState(null)

  // Find the form data based on the ID from the URL
  const formData = sampleForms.find((form) => form.id === formId) || sampleForms[0]

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Simulate data loading
  useEffect(() => {
    // Mark as loaded after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoaded(true)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Filter responses based on selected filter
  const filteredResponses = formData.formResponses.filter((response) => {
    if (responseFilter === "all") return true
    if (responseFilter === "recent") {
      // Filter for responses in the last 7 days
      const responseDate = new Date(response.submittedAt)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return responseDate >= sevenDaysAgo
    }
    if (responseFilter === "older") {
      // Filter for responses older than 7 days
      const responseDate = new Date(response.submittedAt)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return responseDate < sevenDaysAgo
    }
    return true
  })

  // Format date for display
  const formatDate = (dateString) => {
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

  // Handle view details click with proper event handling
  const handleViewDetails = (e, response) => {
    e.preventDefault()
    e.stopPropagation()

    // Close any open dropdown first
    setOpenDropdownId(null)

    // Set a small timeout to ensure dropdown is fully closed
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedResponse(response)
        setResponseDetailsOpen(true)
      }
    }, 10)
  }

  // Handle dialog close with proper cleanup
  const handleDialogClose = () => {
    setResponseDetailsOpen(false)

    // Clear selected response after dialog animation completes
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedResponse(null)
      }
    }, 300)
  }

  // Toggle dropdown with proper event handling
  const toggleDropdown = (e, id) => {
    e.preventDefault()
    e.stopPropagation()

    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  return (
    <ModuleLayout moduleName="Forms" tabs={formsTabs} basePath="/forms">
      <TabContent id="form-details">
        <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          {/* Back button and form name header */}
          <div className="flex flex-col space-y-2">
            <Link
              href="/forms/forms"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to forms
            </Link>
            <h1 className="text-2xl font-bold">{formData.name}</h1>
          </div>

          {/* Header section with filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">Form ID: {formId}</div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {activeTab === "overview" && (
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">Last year</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {activeTab === "responses" && (
                <Select value={responseFilter} onValueChange={setResponseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter responses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All responses</SelectItem>
                    <SelectItem value="recent">Recent (7 days)</SelectItem>
                    <SelectItem value="older">Older</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                      Total Responses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formData.responses}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timeRange === "7days"
                        ? "Last 7 days"
                        : timeRange === "30days"
                          ? "Last 30 days"
                          : timeRange === "90days"
                            ? "Last 90 days"
                            : timeRange === "year"
                              ? "Last year"
                              : "All time"}
                    </p>
                    <div className="mt-4 h-[120px] bg-slate-100 rounded-md flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-slate-300" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formData.completionRate}%</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timeRange === "7days"
                        ? "Last 7 days"
                        : timeRange === "30days"
                          ? "Last 30 days"
                          : timeRange === "90days"
                            ? "Last 90 days"
                            : timeRange === "year"
                              ? "Last year"
                              : "All time"}
                    </p>
                    <div className="mt-4 h-[120px] bg-slate-100 rounded-md flex items-center justify-center">
                      <BarChart2 className="h-16 w-16 text-slate-300" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                      Avg. Time to Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{formData.avgTimeToComplete}</div>
                    <p className="text-sm text-muted-foreground mt-1">minutes:seconds</p>
                    <div className="mt-4 h-[120px] bg-slate-100 rounded-md flex items-center justify-center">
                      <BarChart2 className="h-16 w-16 text-slate-300" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Responses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] bg-slate-100 rounded-md flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-slate-300" />
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-2">
                      {formData.dailyResponses.map((count, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                          </div>
                          <div className="text-2xl font-bold">{count}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Question Completion Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {formData.questionCompletion.map((question, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium truncate max-w-[80%]">{question.question}</span>
                            <span className="text-sm font-medium">{question.completion}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${question.completion}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Device & Demographics Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Device Usage</h3>
                      <div className="space-y-4">
                        {formData.demographics.device.map((device, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{device.type}</span>
                              <span className="text-sm font-medium">{device.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${device.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
                      <div className="space-y-4">
                        {formData.demographics.age.map((ageGroup, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{ageGroup.group}</span>
                              <span className="text-sm font-medium">{ageGroup.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${ageGroup.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Responses Tab */}
          {activeTab === "responses" && (
            <Card>
              <CardHeader>
                <CardTitle>Form Responses</CardTitle>
                <CardDescription>Showing {filteredResponses.length} responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Respondent</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResponses.map((response) => (
                        <TableRow key={response.id}>
                          <TableCell>{formatDate(response.submittedAt)}</TableCell>
                          <TableCell>{response.respondent}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu
                              open={openDropdownId === response.id}
                              onOpenChange={(open) => {
                                if (!open) setOpenDropdownId(null)
                              }}
                            >
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={(e) => toggleDropdown(e, response.id)}>
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    handleViewDetails(e, response)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Versions Tab */}
          {activeTab === "versions" && <FormVersions formId={formId} />}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Form Name</label>
                      <Input value={formData.settings.general.formName} onChange={() => {}} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input value={formData.settings.general.description} onChange={() => {}} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Form Active</div>
                      <div className="text-sm text-muted-foreground">
                        When disabled, users cannot submit new responses
                      </div>
                    </div>
                    <Switch checked={formData.settings.general.isActive} onCheckedChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Collect Email Addresses</div>
                      <div className="text-sm text-muted-foreground">
                        Require respondents to provide their email address
                      </div>
                    </div>
                    <Switch checked={formData.settings.general.collectEmailAddresses} onCheckedChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Allow Anonymous Submissions</div>
                      <div className="text-sm text-muted-foreground">
                        Allow users to submit without identifying information
                      </div>
                    </div>
                    <Switch checked={formData.settings.general.allowAnonymousSubmissions} onCheckedChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Enable CAPTCHA</div>
                      <div className="text-sm text-muted-foreground">Protect your form from spam and abuse</div>
                    </div>
                    <Switch checked={formData.settings.general.enableCaptcha} onCheckedChange={() => {}} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Notify on Submission</div>
                      <div className="text-sm text-muted-foreground">
                        Receive email notifications for new submissions
                      </div>
                    </div>
                    <Switch checked={formData.settings.notifications.notifyOnSubmission} onCheckedChange={() => {}} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notification Emails</label>
                    <Input
                      value={formData.settings.notifications.notificationEmails}
                      onChange={() => {}}
                      placeholder="email@example.com, another@example.com"
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple email addresses with commas</p>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Send Confirmation Email</div>
                      <div className="text-sm text-muted-foreground">
                        Send a confirmation email to respondents after submission
                      </div>
                    </div>
                    <Switch
                      checked={formData.settings.notifications.sendConfirmationEmail}
                      onCheckedChange={() => {}}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmation Email Template</label>
                    <Select value={formData.settings.notifications.confirmationEmailTemplate} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Template</SelectItem>
                        <SelectItem value="minimal">Minimal Template</SelectItem>
                        <SelectItem value="branded">Branded Template</SelectItem>
                        <SelectItem value="custom">Custom Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Type</label>
                    <Select value={formData.settings.access.accessType} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public (Anyone can access)</SelectItem>
                        <SelectItem value="restricted">Restricted (Specific domains)</SelectItem>
                        <SelectItem value="private">Private (Invitation only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Require Login</div>
                      <div className="text-sm text-muted-foreground">Users must be logged in to submit the form</div>
                    </div>
                    <Switch checked={formData.settings.access.requireLogin} onCheckedChange={() => {}} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Allowed Domains</label>
                    <Input
                      value={formData.settings.access.allowedDomains}
                      onChange={() => {}}
                      placeholder="example.com, another-domain.com"
                      disabled={formData.settings.access.accessType !== "restricted"}
                    />
                    <p className="text-xs text-muted-foreground">
                      Only email addresses from these domains can submit the form
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiration Date</label>
                    <Input type="date" value={formData.settings.access.expirationDate} onChange={() => {}} />
                    <p className="text-xs text-muted-foreground">
                      Form will automatically close on this date (leave blank for no expiration)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {/* Response Details Dialog */}
          <Dialog
            open={responseDetailsOpen}
            onOpenChange={(open) => {
              if (!open) handleDialogClose()
            }}
          >
            {selectedResponse && (
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 shrink-0">
                  <DialogTitle>Response Details</DialogTitle>
                  <DialogDescription>
                    Submitted by {selectedResponse.respondent} on {formatDate(selectedResponse.submittedAt)}
                  </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-3 flex items-center justify-between text-sm text-muted-foreground border-b shrink-0">
                  <div>
                    <span className="font-medium">{selectedResponse.answers.length}</span> questions
                  </div>
                  <div className="flex items-center">
                    <ChevronDown className="h-4 w-4 mr-1" />
                    <span>Scroll to view all responses</span>
                  </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                  <div className="p-6 space-y-6">
                    {selectedResponse.answers.map((answer, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2 shrink-0">
                            Q{index + 1}
                          </Badge>
                          <h3 className="font-medium">{answer.question}</h3>
                        </div>

                        {answer.answer ? (
                          <div
                            className={`p-4 rounded-md ${
                              answer.type === "textarea"
                                ? "bg-slate-50 border"
                                : answer.type === "checkbox"
                                  ? "bg-slate-50"
                                  : "bg-slate-50"
                            }`}
                          >
                            <p className={`${answer.type === "textarea" ? "whitespace-pre-wrap" : ""}`}>
                              {answer.answer}
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-md bg-slate-50 border border-dashed text-muted-foreground italic">
                            No answer provided
                          </div>
                        )}

                        {index < selectedResponse.answers.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-between border-t p-6 shrink-0">
                  <div className="text-sm text-muted-foreground">Response ID: {selectedResponse.id}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDialogClose()
                      }}
                      type="button"
                    >
                      Close
                    </Button>
                    <Button type="button">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </TabContent>
    </ModuleLayout>
  )
}

// Helper component for the dropdown menu
function MoreHorizontal(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
