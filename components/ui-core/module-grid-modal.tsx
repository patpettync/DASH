"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ModuleCard } from "@/components/ui-core/module-card"
import { moduleData } from "@/lib/module-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModuleGridModalProps {
  isOpen: boolean
  onClose: () => void
}

// Helper function to get modules with favorites first
const getModulesWithFavorites = (modules: any, favorites: string[]) => {
  return modules
    .map((module: any) => ({
      ...module,
      favorite: favorites.includes(module.id),
    }))
    .sort((a: any, b: any) => {
      if (a.favorite && !b.favorite) return -1
      if (!a.favorite && b.favorite) return 1
      return 0
    })
}

export function ModuleGridModal({ isOpen, onClose }: ModuleGridModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("dashModuleFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("dashModuleFavorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (moduleId: string) => {
    setFavorites((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId)
      } else {
        return [...prev, moduleId]
      }
    })
  }

  // Filter modules based on search query and favorites filter
  const filteredModuleData = Object.entries(moduleData).reduce(
    (acc, [category, modules]) => {
      const filteredModules = modules.filter((module) => {
        const matchesSearch =
          searchQuery === "" ||
          module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFavorites = !showOnlyFavorites || favorites.includes(module.id)

        return matchesSearch && matchesFavorites
      })

      if (filteredModules.length > 0) {
        acc[category] = getModulesWithFavorites(filteredModules, favorites)
      }

      return acc
    },
    {} as Record<string, any[]>,
  )

  // Check if we have any favorites to show
  const hasFavorites = favorites.length > 0

  return (
    <div className={cn("fixed inset-0 z-50", !isOpen && "pointer-events-none opacity-0")}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] p-md max-h-[90vh] overflow-hidden flex flex-col rounded-md">
          <div className="flex items-center justify-between mb-sm">
            <h2 className="text-xl font-semibold">All Modules</h2>
            <div className="flex items-center gap-xs">
              <Button
                variant={showOnlyFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={cn("h-xs gap-1", !hasFavorites && "opacity-50 pointer-events-none")}
                disabled={!hasFavorites}
              >
                <Star className="h-3.5 w-3.5" />
                <span className="text-xs">Favorites</span>
              </Button>
            </div>
          </div>

          <div className="relative mb-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-md">
              {Object.keys(filteredModuleData).length === 0 ? (
                <div className="text-center py-lg text-muted-foreground">
                  <p>No modules found matching your criteria.</p>
                </div>
              ) : (
                Object.entries(filteredModuleData).map(([category, modules]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modules.map((module) => (
                        <div key={module.id} className="relative group">
                          <ModuleCard
                            module={module}
                            onClick={() => {
                              onClose()
                              if (!module.comingSoon && module.href) {
                                window.location.href = module.href
                              }
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-xs right-xs h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(module.id)
                            }}
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                favorites.includes(module.id)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground",
                              )}
                            />
                            <span className="sr-only">
                              {favorites.includes(module.id) ? "Remove from favorites" : "Add to favorites"}
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
