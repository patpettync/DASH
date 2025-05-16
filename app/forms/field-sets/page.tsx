"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Copy, List, Globe, MapPin, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TabContent } from "@/components/layouts/tab-content"
import type { TabItem } from "@/components/layouts/module-tabs"
import { useToast } from "@/hooks/use-toast"

// Define module tabs for the Forms module
const formsTabs: TabItem[] = [
  { href: "/forms/forms", label: "FORMS", exact: true },
  { href: "/forms/field-sets", label: "FIELD SETS" },
]

// Sample field sets data
const sampleFieldSets = [
  {
    id: 1,
    name: "US States",
    category: "Location",
    items: 50,
    lastUpdated: "2023-05-15T09:45:00Z",
    description: "All 50 US states with abbreviations",
    icon: "map-pin",
    system: true,
  },
  {
    id: 2,
    name: "Countries",
    category: "Location",
    items: 195,
    lastUpdated: "2023-04-22T11:20:00Z",
    description: "List of all countries with country codes",
    icon: "globe",
    system: true,
  },
  {
    id: 3,
    name: "Departments",
    category: "Organization",
    items: 8,
    lastUpdated: "2023-05-05T10:15:00Z",
    description: "Company departments for internal forms",
    icon: "users",
    system: false,
  },
  {
    id: 4,
    name: "Product Categories",
    category: "Products",
    items: 12,
    lastUpdated: "2023-05-16T09:00:00Z",
    description: "Categories for product-related forms",
    icon: "list",
    system: false,
  },
  {
    id: 5,
    name: "Event Types",
    category: "Events",
    items: 6,
    lastUpdated: "2023-03-15T08:45:00Z",
    description: "Types of events for registration forms",
    icon: "calendar",
    system: false,
  },
]

// Sample field set items for US States
const usStatesItems = [
  { id: 1, value: "AL", label: "Alabama" },
  { id: 2, value: "AK", label: "Alaska" },
  { id: 3, value: "AZ", label: "Arizona" },
  { id: 4, value: "AR", label: "Arkansas" },
  { id: 5, value: "CA", label: "California" },
  // More states would be listed here
]

export default function FieldSetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewItemsDialogOpen, setIsViewItemsDialogOpen] = useState(false)
  const [selectedFieldSet, setSelectedFieldSet] = useState<any>(null)
  const [newFieldSetName, setNewFieldSetName] = useState("")
  const [newFieldSetCategory, setNewFieldSetCategory] = useState("")
  const [newFieldSetDescription, setNewFieldSetDescription] = useState("")
  const [newFieldSetItems, setNewFieldSetItems] = useState("")
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null)
  const { toast } = useToast()

  // Refs for tracking mounted state and cleanup
  const isMounted = useRef(true)

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Filter field sets based on search query and active tab
  const filteredFieldSets = sampleFieldSets.filter(
    (fieldSet) =>
      fieldSet.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "all" || (activeTab === "system" ? fieldSet.system : !fieldSet.system)),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleAddFieldSet = () => {
    // Validation
    if (!newFieldSetName.trim()) {
      toast({
        title: "Validation Error",
        description: "Field set name is required.",
        variant: "destructive",
      })
      return
    }

    // Process items
    const itemsText = newFieldSetItems.trim()
    if (!itemsText) {
      toast({
        title: "Validation Error",
        description: "At least one item is required.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Field set created",
      description: `Field set "${newFieldSetName}" has been created successfully.`,
    })

    // Reset form and close dialog
    setNewFieldSetName("")
    setNewFieldSetCategory("")
    setNewFieldSetDescription("")
    setNewFieldSetItems("")
    setIsAddDialogOpen(false)
  }

  const handleEditFieldSet = () => {
    if (!selectedFieldSet) return

    toast({
      title: "Field set updated",
      description: `Field set "${selectedFieldSet.name}" has been updated successfully.`,
    })

    // Ensure we clean up state properly
    if (isMounted.current) {
      setIsEditDialogOpen(false)
      // Small delay before clearing selection to prevent UI glitches
      setTimeout(() => {
        if (isMounted.current) {
          setSelectedFieldSet(null)
        }
      }, 100)
    }
  }

  const handleDeleteFieldSet = (fieldSetId: number) => {
    // Close dropdown first to prevent stale references
    setOpenDropdownId(null)

    toast({
      title: "Field set deleted",
      description: "The field set has been deleted successfully.",
    })
  }

  const handleDuplicateFieldSet = (fieldSetId: number) => {
    // Close dropdown first to prevent stale references
    setOpenDropdownId(null)

    toast({
      title: "Field set duplicated",
      description: "The field set has been duplicated successfully.",
    })
  }

  const openViewItemsDialog = (fieldSet: any, e?: React.MouseEvent) => {
    // Prevent event bubbling if event is provided
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Close dropdown if it was opened from there
    setOpenDropdownId(null)

    // Set selected field set and open dialog
    setSelectedFieldSet(fieldSet)
    setIsViewItemsDialogOpen(true)
  }

  const openEditDialog = (fieldSet: any) => {
    // Close dropdown first
    setOpenDropdownId(null)

    setSelectedFieldSet(fieldSet)
    setIsEditDialogOpen(true)
  }

  const handleDialogClose = () => {
    // Use setTimeout to ensure state updates don't conflict
    setTimeout(() => {
      if (isMounted.current) {
        setSelectedFieldSet(null)
      }
    }, 100)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "map-pin":
        return <MapPin className="h-4 w-4" />
      case "globe":
        return <Globe className="h-4 w-4" />
      case "users":
        return <Users className="h-4 w-4" />
      case "list":
        return <List className="h-4 w-4" />
      case "calendar":
        return <Calendar className="h-4 w-4" />
      default:
        return <List className="h-4 w-4" />
    }
  }

  // Handle dropdown toggle
  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  return (
    <ModuleLayout moduleName="Forms" tabs={formsTabs} basePath="/forms">
      <TabContent id="field-sets">
        <div className="space-y-6">
          {/* Header section with search and filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search field sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field Set
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Field Set</DialogTitle>
                    <DialogDescription>
                      Create a new field set to use in your forms. Each item should be on a new line with value and
                      label separated by a comma.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newFieldSetName}
                        onChange={(e) => setNewFieldSetName(e.target.value)}
                        className="col-span-3"
                        placeholder="e.g., US States"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={newFieldSetCategory}
                        onChange={(e) => setNewFieldSetCategory(e.target.value)}
                        className="col-span-3"
                        placeholder="e.g., Location"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newFieldSetDescription}
                        onChange={(e) => setNewFieldSetDescription(e.target.value)}
                        className="col-span-3"
                        placeholder="Brief description of this field set"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="items" className="text-right pt-2">
                        Items
                      </Label>
                      <Textarea
                        id="items"
                        value={newFieldSetItems}
                        onChange={(e) => setNewFieldSetItems(e.target.value)}
                        className="col-span-3 min-h-[150px]"
                        placeholder="AL, Alabama&#10;AK, Alaska&#10;AZ, Arizona"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFieldSet}>Create Field Set</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Field Sets Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Field Sets</CardTitle>
              <CardDescription>Manage pre-populated dropdown fields that can be used in your forms</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFieldSets.length > 0 ? (
                    filteredFieldSets.map((fieldSet) => (
                      <TableRow key={fieldSet.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="mr-2 text-muted-foreground">{getIconComponent(fieldSet.icon)}</div>
                            <button
                              onClick={(e) => openViewItemsDialog(fieldSet, e)}
                              className="hover:underline text-left"
                              type="button"
                            >
                              {fieldSet.name}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>{fieldSet.category}</TableCell>
                        <TableCell>{fieldSet.items}</TableCell>
                        <TableCell>{formatDate(fieldSet.lastUpdated)}</TableCell>
                        <TableCell>
                          <Badge variant={fieldSet.system ? "secondary" : "default"}>
                            {fieldSet.system ? "System" : "Custom"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu
                            open={openDropdownId === fieldSet.id}
                            onOpenChange={() => toggleDropdown(fieldSet.id)}
                          >
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  openViewItemsDialog(fieldSet)
                                }}
                              >
                                <List className="mr-2 h-4 w-4" />
                                View Items
                              </DropdownMenuItem>
                              {!fieldSet.system && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault()
                                    openEditDialog(fieldSet)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleDuplicateFieldSet(fieldSet.id)
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              {!fieldSet.system && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleDeleteFieldSet(fieldSet.id)
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        {searchQuery ? <>No field sets found matching "{searchQuery}"</> : <>No field sets found</>}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* View Items Dialog */}
        <Dialog
          open={isViewItemsDialogOpen}
          onOpenChange={(open) => {
            setIsViewItemsDialogOpen(open)
            if (!open) handleDialogClose()
          }}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{selectedFieldSet?.name} Items</DialogTitle>
              <DialogDescription>{selectedFieldSet?.description}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead>Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usStatesItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.value}</TableCell>
                      <TableCell>{item.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsViewItemsDialogOpen(false)
                  handleDialogClose()
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Field Set Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) handleDialogClose()
          }}
        >
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Field Set</DialogTitle>
              <DialogDescription>Update your field set details and items.</DialogDescription>
            </DialogHeader>
            {selectedFieldSet && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input id="edit-name" defaultValue={selectedFieldSet.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Input id="edit-category" defaultValue={selectedFieldSet.category} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Input id="edit-description" defaultValue={selectedFieldSet.description} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-items" className="text-right pt-2">
                    Items
                  </Label>
                  <Textarea
                    id="edit-items"
                    className="col-span-3 min-h-[150px]"
                    defaultValue={usStatesItems
                      .slice(0, 5)
                      .map((item) => `${item.value}, ${item.label}`)
                      .join("\n")}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  handleDialogClose()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditFieldSet}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabContent>
    </ModuleLayout>
  )
}
