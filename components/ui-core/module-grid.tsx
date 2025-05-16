"use client"

import { useState, useEffect, useCallback } from "react"
import { ModuleCard } from "@/components/ui-core/module-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { moduleData } from "@/lib/module-data"
import { useToast } from "@/hooks/use-toast"

// Local storage key for favorites
const FAVORITES_STORAGE_KEY = "dashModuleFavorites"

export function ModuleGrid() {
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
        console.log("Loaded favorites:", parsedFavorites)
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
        console.log("Saving favorites:", favorites)
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (e) {
        console.error("Error saving favorites to localStorage:", e)
      }
    }
  }, [favorites, isInitialized])

  // Toggle favorite status with useCallback to prevent unnecessary re-renders
  const toggleFavorite = useCallback(
    (moduleId: string, isFavorite: boolean) => {
      console.log(`Toggling favorite for ${moduleId} to ${isFavorite}`)

      setFavorites((prevFavorites) => {
        let newFavorites

        if (isFavorite) {
          // Add to favorites if not already included
          newFavorites = prevFavorites.includes(moduleId) ? prevFavorites : [...prevFavorites, moduleId]
        } else {
          // Remove from favorites
          newFavorites = prevFavorites.filter((id) => id !== moduleId)
        }

        // Show toast notification
        const module = moduleData.find((m) => m.id === moduleId)
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

  // Switch from favorites tab to all tab if removing the last favorite
  useEffect(() => {
    if (activeTab === "favorites" && favorites.length === 0 && isInitialized) {
      setActiveTab("all")
    }
  }, [favorites, activeTab, isInitialized])

  // Filter modules based on search query
  const filteredModules = moduleData.filter((module) => {
    return (
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Group modules by category
  const groupedModules = filteredModules.reduce(
    (acc, module) => {
      const category = module.category || "Other"
      if (!acc[category]) acc[category] = []
      acc[category].push(module)
      return acc
    },
    {} as Record<string, typeof moduleData>,
  )

  // Get unique categories
  const categories = ["Core Modules", "Admin", "Coming Soon"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-auto">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={cn("w-full sm:w-auto", isDark ? "bg-gray-800" : "")}>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites
                {favorites.length > 0 && (
                  <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="hidden md:inline-flex">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search modules..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="all" className="m-0">
          {Object.entries(groupedModules).map(([category, modules]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isFavorite={favorites.includes(module.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="favorites" className="m-0">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No favorites yet. Click the star icon on any module to add it to your favorites.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredModules
                .filter((module) => favorites.includes(module.id))
                .map((module) => (
                  <ModuleCard key={module.id} module={module} isFavorite={true} onToggleFavorite={toggleFavorite} />
                ))}
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="m-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredModules
                .filter((module) => module.category === category)
                .map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    isFavorite={favorites.includes(module.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
