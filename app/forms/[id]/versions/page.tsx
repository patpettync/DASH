"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, Plus, BarChart2, ArrowLeft, Clock, RotateCcw, Eye } from 'lucide-react'
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
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const handleViewVersion = (versionId: number) => {
    // In a real app, this would navigate to a preview of this version
    router.push(`/forms/${formId}/versions/${versionId}/preview`)
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
    <ModuleLayout moduleName="Forms" sidebarSections={formsSidebarSections}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/forms/${formId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Form
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{formName} - Version History</h1>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Version History</CardTitle>
            <CardDescription>
              View and restore previous versions of your form. Restoring a version will create a new version based on
              the selected one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleVersions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">Version {version.versionNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(version.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{version.createdBy}</TableCell>
                    <TableCell>{version.changes}</TableCell>
                    <TableCell>{version.current ? <Badge>Current</Badge> : null}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewVersion(version.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {!version.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreVersion(version.versionNumber)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

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
    </ModuleLayout>
  )
}
