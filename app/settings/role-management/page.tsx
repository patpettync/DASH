"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash, Eye, Copy, GitBranch } from "lucide-react"
import { useToast } from "@/components/ui-core/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViewPermissionsModal } from "@/components/ui-core/view-permissions-modal"
import { RoleCloneModal } from "@/components/ui-core/role-clone-modal"
import { RoleHierarchyVisualization } from "@/components/ui-core/role-hierarchy-visualization"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { settingsTabs } from "@/lib/settings-tabs"
import { useLoading } from "@/contexts/loading-context"

// Mock roles data with parent-child relationships
const mockRoles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    isSystem: true,
    parentId: null,
    permissions: {
      users: ["view", "create", "edit", "delete"],
      roles: ["view", "create", "edit", "delete"],
      settings: ["view", "edit"],
      modules: ["view", "install", "configure", "uninstall"],
      forms: ["view", "create", "edit", "delete", "publish"],
      analytics: ["view", "export"],
    },
  },
  {
    id: 2,
    name: "Manager",
    description: "Access to manage users and content",
    userCount: 8,
    isSystem: false,
    parentId: 1, // Child of Administrator
    permissions: {
      users: ["view"],
      roles: ["view"],
      settings: ["view"],
      modules: ["view"],
      forms: ["view", "create", "edit", "publish"],
      analytics: ["view", "export"],
    },
  },
  {
    id: 3,
    name: "User",
    description: "Basic access to use the platform",
    userCount: 24,
    isSystem: true,
    parentId: 2, // Child of Manager
    permissions: {
      users: [],
      roles: [],
      settings: [],
      modules: ["view"],
      forms: ["view", "create", "edit"],
      analytics: ["view"],
    },
  },
  {
    id: 4,
    name: "Guest",
    description: "Limited access for external users",
    userCount: 5,
    isSystem: false,
    parentId: 3, // Child of User
    permissions: {
      users: [],
      roles: [],
      settings: [],
      modules: [],
      forms: ["view"],
      analytics: [],
    },
  },
  {
    id: 5,
    name: "Analyst",
    description: "Access to analytics and reporting",
    userCount: 6,
    isSystem: false,
    parentId: 2, // Child of Manager
    permissions: {
      users: [],
      roles: [],
      settings: [],
      modules: ["view"],
      forms: ["view"],
      analytics: ["view", "export"],
    },
  },
  {
    id: 6,
    name: "Content Editor",
    description: "Can create and edit content",
    userCount: 12,
    isSystem: false,
    parentId: 2, // Child of Manager
    permissions: {
      users: [],
      roles: [],
      settings: [],
      modules: ["view"],
      forms: ["view", "create", "edit", "publish"],
      analytics: [],
    },
  },
  {
    id: 7,
    name: "Support Agent",
    description: "Customer support access",
    userCount: 8,
    isSystem: false,
    parentId: 3, // Child of User
    permissions: {
      users: ["view"],
      roles: [],
      settings: [],
      modules: ["view"],
      forms: ["view"],
      analytics: [],
    },
  },
]

// Permission categories and actions
const permissionCategories = [
  {
    id: "users",
    name: "User Management",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    id: "roles",
    name: "Role Management",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    id: "settings",
    name: "System Settings",
    actions: ["view", "edit"],
  },
  {
    id: "modules",
    name: "Modules",
    actions: ["view", "install", "configure", "uninstall"],
  },
  {
    id: "forms",
    name: "Forms",
    actions: ["view", "create", "edit", "delete", "publish"],
  },
  {
    id: "analytics",
    name: "Analytics",
    actions: ["view", "export"],
  },
]

export default function RoleManagementPage() {
  const { addToast } = useToast()
  const [roles, setRoles] = useState(mockRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("roles")
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isViewRoleOpen, setIsViewRoleOpen] = useState(false)
  const [isCloneRoleOpen, setIsCloneRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    parentId: null as number | null,
    permissions: {
      users: [],
      roles: [],
      settings: [],
      modules: [],
      forms: [],
      analytics: [],
    },
  })

  const { startLoading, stopLoading } = useLoading()
  const isInitialMount = useRef(true)

  // Fixed loading effect - only runs on mount
  useEffect(() => {
    // Only run this effect once on mount
    if (isInitialMount.current) {
      startLoading("roleManagement")

      const timer = setTimeout(() => {
        stopLoading("roleManagement")
      }, 800)

      return () => {
        clearTimeout(timer)
      }
    }
  }, []) // Empty dependency array - only runs on mount

  // Set isInitialMount to false after the first render
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Separate cleanup effect for unmounting
  useEffect(() => {
    return () => {
      stopLoading("roleManagement")
    }
  }, [stopLoading])

  // Get all existing role names for validation
  const existingRoleNames = roles.map((role) => role.name)

  // Debounced search to prevent excessive filtering
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
  }, 300)

  // Filter roles based on search query
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddRole = () => {
    // Validate form
    if (!newRole.name) {
      addToast({
        title: "Validation Error",
        description: "Please provide a role name.",
        variant: "error",
      })
      return
    }

    // Check for duplicate names
    if (existingRoleNames.includes(newRole.name)) {
      addToast({
        title: "Validation Error",
        description: "A role with this name already exists.",
        variant: "error",
      })
      return
    }

    // Add new role
    const id = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1

    setRoles([
      ...roles,
      {
        id,
        ...newRole,
        userCount: 0,
        isSystem: false,
      },
    ])

    // Close dialog and reset form
    setIsAddRoleOpen(false)
    setNewRole({
      name: "",
      description: "",
      parentId: null,
      permissions: {
        users: [],
        roles: [],
        settings: [],
        modules: [],
        forms: [],
        analytics: [],
      },
    })

    // Show success toast
    addToast({
      title: "Role Added",
      description: `${newRole.name} role has been created successfully.`,
      variant: "success",
    })
  }

  const handleDeleteRole = (roleId: number) => {
    const roleToDelete = roles.find((role) => role.id === roleId)

    if (roleToDelete?.isSystem) {
      addToast({
        title: "Cannot Delete",
        description: "System roles cannot be deleted.",
        variant: "error",
      })
      return
    }

    // Check if any roles have this role as a parent
    const hasChildren = roles.some((role) => role.parentId === roleId)
    if (hasChildren) {
      addToast({
        title: "Cannot Delete",
        description: "This role has child roles. Please reassign or delete them first.",
        variant: "error",
      })
      return
    }

    setRoles(roles.filter((role) => role.id !== roleId))

    addToast({
      title: "Role Deleted",
      description: `${roleToDelete?.name} role has been deleted successfully.`,
      variant: "success",
    })
  }

  // Optimized handler for viewing role permissions
  const handleViewRole = useCallback((role: any) => {
    // Use requestAnimationFrame to ensure UI updates before modal opens
    requestAnimationFrame(() => {
      setSelectedRole(role)
      setIsViewRoleOpen(true)
    })
  }, [])

  // Optimized handler for closing the view permissions modal
  const handleCloseViewRole = useCallback(() => {
    setIsViewRoleOpen(false)

    // Clear the selected role after a short delay to allow animations to complete
    setTimeout(() => {
      setSelectedRole(null)
    }, 300)
  }, [])

  // Handler for opening the clone role modal
  const handleOpenCloneRole = useCallback((role: any) => {
    requestAnimationFrame(() => {
      setSelectedRole(role)
      setIsCloneRoleOpen(true)
    })
  }, [])

  // Handler for closing the clone role modal
  const handleCloseCloneRole = useCallback(() => {
    setIsCloneRoleOpen(false)

    // Clear the selected role after a short delay
    setTimeout(() => {
      setSelectedRole(null)
    }, 300)
  }, [])

  // Handler for cloning a role
  const handleCloneRole = useCallback(
    (newRoleData: Omit<(typeof roles)[0], "id" | "userCount" | "isSystem">) => {
      // Generate a new ID
      const id = roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1

      // Create the new role
      const clonedRole = {
        ...newRoleData,
        id,
        userCount: 0,
        isSystem: false,
      }

      // Add to roles list
      setRoles((prev) => [...prev, clonedRole])

      // Show success toast
      addToast({
        title: "Role Cloned",
        description: `${newRoleData.name} has been created successfully.`,
        variant: "success",
      })
    },
    [roles, addToast],
  )

  const togglePermission = (category: string, action: string) => {
    setNewRole((prev) => {
      const currentPermissions = [...(prev.permissions[category as keyof typeof prev.permissions] || [])]

      if (currentPermissions.includes(action)) {
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [category]: currentPermissions.filter((a) => a !== action),
          },
        }
      } else {
        return {
          ...prev,
          permissions: {
            ...prev.permissions,
            [category]: [...currentPermissions, action],
          },
        }
      }
    })
  }

  // Cleanup effect to ensure state is reset when component unmounts
  useEffect(() => {
    return () => {
      setSelectedRole(null)
      setIsViewRoleOpen(false)
      setIsCloneRoleOpen(false)
    }
  }, [])

  return (
    <ModuleLayout moduleName="System Settings" tabs={settingsTabs} basePath="/settings">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="hierarchy">Role Hierarchy</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="pt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Roles</CardTitle>
                  <Button onClick={() => setIsAddRoleOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Role
                  </Button>
                </div>
                <CardDescription>Manage roles and their associated permissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search roles..."
                      className="pl-8"
                      onChange={(e) => debouncedSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {role.name}
                              {role.parentId && (
                                <Badge variant="outline" className="ml-2 bg-slate-50 text-slate-700">
                                  <GitBranch className="mr-1 h-3 w-3" />
                                  Inherits
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.userCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={role.isSystem ? "secondary" : "outline"}
                              className={
                                role.isSystem
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }
                            >
                              {role.isSystem ? "System" : "Custom"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleViewRole(role)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleOpenCloneRole(role)
                                  }}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Clone Role
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteRole(role.id)
                                  }}
                                  disabled={role.isSystem}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredRoles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No roles found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hierarchy" className="pt-4">
            <RoleHierarchyVisualization roles={roles} onRoleClick={handleViewRole} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions. You can assign this role to users later.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Role Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent-role">Parent Role (Optional)</Label>
                <select
                  id="parent-role"
                  className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newRole.parentId || ""}
                  onChange={(e) =>
                    setNewRole({
                      ...newRole,
                      parentId: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                >
                  <option value="">None (Top-level role)</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="py-4">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permission Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {category.actions.map((action) => (
                              <div key={action} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${category.id}-${action}`}
                                  checked={newRole.permissions[
                                    category.id as keyof typeof newRole.permissions
                                  ]?.includes(action)}
                                  onCheckedChange={() => togglePermission(category.id, action)}
                                />
                                <label htmlFor={`${category.id}-${action}`} className="text-sm font-medium capitalize">
                                  {action}
                                </label>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Optimized View Role Permissions Modal */}
      <ViewPermissionsModal
        isOpen={isViewRoleOpen}
        onClose={handleCloseViewRole}
        role={selectedRole}
        permissionCategories={permissionCategories}
      />

      {/* Role Clone Modal */}
      <RoleCloneModal
        isOpen={isCloneRoleOpen}
        onClose={handleCloseCloneRole}
        role={selectedRole}
        existingRoleNames={existingRoleNames}
        onClone={handleCloneRole}
      />
    </ModuleLayout>
  )
}
