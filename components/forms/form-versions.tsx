"use client"

import { useState } from "react"
import { MoreHorizontal, History, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample form version data
const sampleVersions = [
  {
    id: "v3",
    versionNumber: 3,
    createdAt: "2025-04-30T09:45:00Z",
    createdBy: "John Doe",
    changes: "Added new question about customer service",
    current: true,
  },
  {
    id: "v2",
    versionNumber: 2,
    createdAt: "2025-04-14T14:30:00Z",
    createdBy: "John Doe",
    changes: "Updated rating scale and fixed typos",
    current: false,
  },
  {
    id: "v1",
    versionNumber: 1,
    createdAt: "2025-03-31T11:20:00Z",
    createdBy: "Jane Smith",
    changes: "Initial release",
    current: false,
  },
]

export function FormVersions({ formId }: { formId: string }) {
  const { toast } = useToast()
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleViewVersion = (versionId: string) => {
    // In a real app, this would navigate to a preview of this version
    toast({
      title: "View Version",
      description: `Viewing version ${versionId}`,
    })
  }

  const handleRestoreVersion = (versionId: string) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Form Versions</CardTitle>
        <CardDescription>History of changes made to this form</CardDescription>
      </CardHeader>
      <CardContent>
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
                    {version.current ? <Badge>active</Badge> : <Badge variant="secondary">archived</Badge>}
                  </TableCell>
                  <TableCell>{version.changes}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleViewVersion(version.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {!version.current && (
                          <DropdownMenuItem onSelect={() => handleRestoreVersion(version.id)}>
                            <History className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* "Create New Version" button has been completely removed */}

        <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore Version</DialogTitle>
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
      </CardContent>
    </Card>
  )
}
