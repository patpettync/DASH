"use client"

import { useState, useEffect, useCallback } from "react"
import { FileText, BarChart2, FileQuestion, Settings, Database, GitBranch, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserWelcomePanel } from "@/components/ui-core/user-welcome-panel"
import { ModuleCard } from "@/components/ui-core/module-card"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import { MainLayout } from "@/components/layouts/main-layout"
import { useToast } from "@/hooks/use-toast"

// Mock module data
const modules = [
  {
    id: "forms",
    name: "Forms",
    description: "Create and manage digital forms and surveys",
    icon: FileText,
    href: "/forms",
    category: "core",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Data visualization and reporting tools",
    icon: BarChart2,
    href: "/analytics",
    category: "core",
  },
  {
    id: "pir",
    name: "Public Information Requests",
    description: "Manage and process public information requests",
    icon: FileQuestion,
    href: "/pir",
    category: "core",
  },
  {
    id: "settings",
    name: "System Settings",
    description: "Configure system-wide settings, users, roles, and permissions",
    icon: Settings,
    href: "/settings",
    category: "admin",
    adminOnly: true,
  },
  {
    id: "integrations",
    name: "Integrations",
    description: "Connect with external services and APIs",
    icon: Database,
    href: "/integrations",
    category: "admin",
    adminOnly: true,
  },
  {
    id: "workflows",
    name: "Workflows",
    description: "Automate business processes and approvals",
    icon: GitBranch,
    href: "/workflows",
    category: "coming-soon",
    comingSoon: true,
  },
  {
    id: "projects",
    name: "Projects",
    description: "Project management and collaboration",
    icon: Layers,
    href: "/projects",
    category: "coming-soon",
    comingSoon: true,
  },
]

// Local storage key for favorites
const FAVORITES_STORAGE_KEY = "dashModuleFavorites"

export default function DashboardPage() {
  const { isDark } = useTheme()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites)
        setFavorites(parsedFavorites)
      }
    } catch (e) {
      console.error("Error loading favorites from localStorage:", e)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    // Only save after initial load to prevent overwriting
    if (isInitialized) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (e) {
        console.error("Error saving favorites to localStorage:", e)
      }
    }
  }, [favorites, isInitialized])

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (moduleId: string, isFavorite: boolean) => {
      setFavorites((prevFavorites) => {
        let newFavorites

        if (isFavorite) {
          // Add to favorites if not already included
          newFavorites = prevFavorites.includes(moduleId) ? prevFavorites : [...prevFavorites, moduleId]
        } else {
          // Remove from favorites
          newFavorites = prevFavorites.filter((id) => id !== moduleId)
        }

        // Show toast notification with theme-aware styling
        const module = modules.find((m) => m.id === moduleId)
        if (module) {
          toast({
            title: isFavorite ? "Added to favorites" : "Removed from favorites",
            description: `${module.name} has been ${isFavorite ? "added to" : "removed from"} your favorites.`,
            duration: 2000,
          })
        }

        return newFavorites
      })
    },
    [toast],
  )

  // Filter modules based on search query and active tab
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "favorites") return matchesSearch && favorites.includes(module.id)
    return matchesSearch && module.category === activeTab
  })

  // Group modules by category
  const groupedModules = filteredModules.reduce(
    (acc, module) => {
      const category = module.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(module)
      return acc
    },
    {} as Record<string, typeof modules>,
  )

  return (
    <MainLayout>
      <div className="space-y-lg">
        {/* Welcome Panel */}
        <UserWelcomePanel />

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row justify-between gap-sm">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto h-10 p-xs bg-muted border border-muted">
              <TabsTrigger
                value="all"
                className={cn(
                  "flex-1 md:flex-none",
                  activeTab === "all" ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]" : "",
                )}
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className={cn(
                  "flex-1 md:flex-none",
                  activeTab === "favorites" ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]" : "",
                )}
              >
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-xs text-xs px-xs py-0.5 rounded-full bg-[var(--brand-primary-10,rgba(var(--brand-primary-rgb),0.1))] text-[var(--brand-primary)]">
                    {favorites.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="core"
                className={cn(
                  "flex-1 md:flex-none",
                  activeTab === "core" ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]" : "",
                )}
              >
                Core Modules
              </TabsTrigger>
              <TabsTrigger
                value="admin"
                className={cn(
                  "flex-1 md:flex-none",
                  activeTab === "admin" ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]" : "",
                )}
              >
                Admin
              </TabsTrigger>
              <TabsTrigger
                value="coming-soon"
                className={cn(
                  "flex-1 md:flex-none",
                  activeTab === "coming-soon" ? "bg-[var(--brand-primary)] text-[var(--brand-primary-foreground)]" : "",
                )}
              >
                Coming Soon
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-64">
            <Input
              type="search"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-sm top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Module Grid */}
        <div className="space-y-lg">
          {activeTab === "all" || activeTab === "favorites" ? (
            <>
              {/* Core Modules */}
              {groupedModules.core && groupedModules.core.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-sm text-foreground">Core Modules</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {groupedModules.core.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        isFavorite={favorites.includes(module.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin */}
              {groupedModules.admin && groupedModules.admin.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-sm text-foreground">Admin</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {groupedModules.admin.map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        isFavorite={favorites.includes(module.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Coming Soon */}
              {groupedModules["coming-soon"] && groupedModules["coming-soon"].length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-sm text-foreground">Coming Soon</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                    {groupedModules["coming-soon"].map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        isFavorite={favorites.includes(module.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isFavorite={favorites.includes(module.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}

          {/* No results */}
          {filteredModules.length === 0 && (
            <div className="py-3xl text-center">
              <h3 className="text-lg font-medium text-foreground">No modules found</h3>
              <p className="mt-xs text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
