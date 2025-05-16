"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample form version data
const sampleVersions = [
  {
    id: 1,
    versionNumber: 3,
    createdAt: "2023-05-15T09:45:00Z",
    createdBy: "John Doe",
    changes: "Updated form validation rules and added new fields",
    current: true,
  },
  {
    id: 2,
    versionNumber: 2,
    createdAt: "2023-05-12T14:30:00Z",
    createdBy: "John Doe",
    changes: "Modified field labels and help text",
    current: false,
  },
  {
    id: 3,
    versionNumber: 1,
    createdAt: "2023-05-10T11:20:00Z",
    createdBy: "Jane Smith",
    changes: "Initial form creation",
    current: false,
  },
]

export default function FormVersionsPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id
  const { toast } = useToast()
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

  // This would typically come from an API call
  const formName = "Customer Feedback Form"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleViewVersion = (versionId: number) => {
    // In a real app, this would navigate to a preview of this version
    router.push(`/forms/forms/${formId}/versions/${versionId}/preview`)
  }

  const handleRestoreVersion = (versionId: number) => {
    setSelectedVersion(versionId)
    setShowRestoreDialog(true)
  }

  const confirmRestore = () => {
    // In a real app, this would make an API call to restore the version
    toast({
      title: "Version restored",
      description: `Form has been restored to version ${selectedVersion}.`,
    })
    setShowRestoreDialog(false)
    // Refresh the page or update the data
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/forms/forms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to forms
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{formName}</h1>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">Form ID: {formId}</p>

      <Tabs defaultValue="versions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="versions" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-purple-600">Form Versions</h2>
              <p className="text-muted-foreground">History of changes made to this form</p>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleVersions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">Version {version.versionNumber}</TableCell>
                      <TableCell>{formatDate(version.createdAt)}</TableCell>
                      <TableCell>
                        {version.current ? (
                          <Badge className="bg-blue-600">active</Badge>
                        ) : (
                          <Badge variant="outline">archived</Badge>
                        )}
                      </TableCell>
                      <TableCell>{version.changes}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* "Create New Version" button has been completely removed */}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version {selectedVersion}</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this version? This will create a new version based on version{" "}
              {selectedVersion}. The current version will still be available in the version history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRestore}>Restore Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
