"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronRight, ChevronDown, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"

interface Role {
  id: number
  name: string
  description: string
  userCount: number
  isSystem: boolean
  permissions: {
    [key: string]: string[]
  }
  parentId?: number | null
}

interface RoleNode extends Role {
  children: RoleNode[]
  level: number
  expanded?: boolean
}

interface RoleHierarchyVisualizationProps {
  roles: Role[]
  onRoleClick?: (role: Role) => void
}

export function RoleHierarchyVisualization({ roles, onRoleClick }: RoleHierarchyVisualizationProps) {
  const [hierarchyData, setHierarchyData] = useState<RoleNode[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  const [zoomLevel, setZoomLevel] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Build the hierarchy tree from flat roles array
  useEffect(() => {
    // Create a map for quick lookup
    const roleMap = new Map<number, RoleNode>()

    // First pass: create all nodes
    roles.forEach((role) => {
      roleMap.set(role.id, {
        ...role,
        children: [],
        level: 0,
        expanded: true,
      })
    })

    // Second pass: build the tree
    const rootNodes: RoleNode[] = []

    roles.forEach((role) => {
      const node = roleMap.get(role.id)!

      if (role.parentId && roleMap.has(role.parentId)) {
        // This is a child node
        const parent = roleMap.get(role.parentId)!
        parent.children.push(node)
        node.level = parent.level + 1
      } else {
        // This is a root node
        rootNodes.push(node)
      }
    })

    // Sort nodes by name at each level
    const sortNodes = (nodes: RoleNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name))
      nodes.forEach((node) => {
        if (node.children.length > 0) {
          sortNodes(node.children)
        }
      })
    }

    sortNodes(rootNodes)
    setHierarchyData(rootNodes)

    // Initialize expanded nodes
    const expanded = new Set<number>()
    rootNodes.forEach((node) => {
      expanded.add(node.id)
    })
    setExpandedNodes(expanded)
  }, [roles])

  // Handle node expansion toggle
  const toggleNodeExpansion = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  // Expand all nodes
  const expandAll = () => {
    const allIds = new Set<number>()
    const addAllIds = (nodes: RoleNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id)
        if (node.children.length > 0) {
          addAllIds(node.children)
        }
      })
    }
    addAllIds(hierarchyData)
    setExpandedNodes(allIds)
  }

  // Collapse all nodes except root
  const collapseAll = () => {
    const rootIds = new Set<number>()
    hierarchyData.forEach((node) => {
      rootIds.add(node.id)
    })
    setExpandedNodes(rootIds)
  }

  // Recursive function to render the tree
  const renderTree = (nodes: RoleNode[]) => {
    return (
      <ul className="pl-0 space-y-1">
        {nodes.map((node) => (
          <li key={node.id} className="relative">
            <div
              className={`
                flex items-center p-2 rounded-md hover:bg-slate-50 transition-colors
                ${node.level > 0 ? "ml-6 border-l-2 border-slate-200 pl-4" : ""}
              `}
            >
              {node.children.length > 0 && (
                <button
                  onClick={() => toggleNodeExpansion(node.id)}
                  className="mr-2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-slate-200"
                >
                  {expandedNodes.has(node.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}

              <div className="flex-1 flex items-center cursor-pointer" onClick={() => onRoleClick && onRoleClick(node)}>
                <span className="font-medium">{node.name}</span>

                <Badge
                  variant={node.isSystem ? "secondary" : "outline"}
                  className={`ml-2 ${
                    node.isSystem
                      ? isDark
                        ? "bg-gray-800 text-gray-300 border-gray-700"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                      : isDark
                        ? "bg-gray-800 text-gray-400 border-gray-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {node.isSystem ? "System" : "Custom"}
                </Badge>

                <span className="ml-2 text-sm text-slate-500">
                  ({node.userCount} {node.userCount === 1 ? "user" : "users"})
                </span>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-2 h-5 w-5 rounded-full hover:bg-slate-200 flex items-center justify-center">
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{node.description}</p>
                      <div className="mt-1 pt-1 border-t border-slate-200">
                        <p className="text-xs font-semibold">Permissions:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(node.permissions).map(
                            ([category, actions]) =>
                              actions.length > 0 && (
                                <Badge key={category} variant="outline" className="text-xs">
                                  {category}: {actions.length}
                                </Badge>
                              ),
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {node.children.length > 0 && expandedNodes.has(node.id) && (
              <div className="mt-1">{renderTree(node.children)}</div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  // Calculate permission counts for the legend
  const permissionCounts = useMemo(() => {
    const counts: Record<string, Set<string>> = {}

    roles.forEach((role) => {
      Object.entries(role.permissions).forEach(([category, actions]) => {
        if (!counts[category]) {
          counts[category] = new Set()
        }

        actions.forEach((action) => {
          counts[category].add(action)
        })
      })
    })

    return Object.entries(counts).map(([category, actions]) => ({
      category,
      count: actions.size,
    }))
  }, [roles])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Role Hierarchy</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">{Math.round(zoomLevel * 100)}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleResetZoom} className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <CardDescription>Visualize role relationships and permission inheritance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2 border-b pb-3">
          <span className="text-sm font-medium">Permission Categories:</span>
          {permissionCounts.map(({ category, count }) => (
            <Badge key={category} variant="outline" className="bg-slate-50">
              {category} ({count})
            </Badge>
          ))}
        </div>

        <div
          ref={containerRef}
          className="overflow-auto max-h-[500px] pr-4"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top left",
            transition: "transform 0.2s ease-out",
          }}
        >
          {hierarchyData.length > 0 ? (
            renderTree(hierarchyData)
          ) : (
            <div className="text-center py-8 text-slate-500">No role hierarchy data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
