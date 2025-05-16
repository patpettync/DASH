"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Filter, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ActivityLogFilters, User, ActivityAction } from "@/types/user-management"

interface ActivityLogFiltersProps {
  users: User[]
  onFilterChange: (filters: ActivityLogFilters) => void
  className?: string
}

export function ActivityLogFilters({ users, onFilterChange, className }: ActivityLogFiltersProps) {
  const [filters, setFilters] = useState<ActivityLogFilters>({
    userId: undefined,
    action: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    searchQuery: "",
  })
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)
  const [filtersVisible, setFiltersVisible] = useState(false)

  // Activity types for the dropdown
  const activityTypes: { value: ActivityAction; label: string }[] = [
    { value: "login", label: "Login" },
    { value: "login_failed", label: "Failed Login" },
    { value: "logout", label: "Logout" },
    { value: "password_reset", label: "Password Reset" },
    { value: "profile_update", label: "Profile Update" },
    { value: "role_change", label: "Role Change" },
    { value: "status_change", label: "Status Change" },
    { value: "user_created", label: "User Created" },
    { value: "user_deleted", label: "User Deleted" },
    { value: "settings_change", label: "Settings Change" },
    { value: "data_export", label: "Data Export" },
    { value: "api_access", label: "API Access" },
  ]

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Handle filter changes
  const updateFilter = (key: keyof ActivityLogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      userId: undefined,
      action: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      searchQuery: "",
    })
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).filter((value) => value !== undefined && value !== "").length

  return (
    <div className={cn("space-y-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={filters.searchQuery || ""}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
            className="pl-8"
          />
          {filters.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10"
              onClick={() => updateFilter("searchQuery", "")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" className="ml-xs gap-1" onClick={() => setFiltersVisible(!filtersVisible)}>
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-xxs rounded-full bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-xs">
            Reset
          </Button>
        )}
      </div>

      {filtersVisible && (
        <div className="grid grid-cols-1 gap-4 rounded-md border border-gray-200 dark:border-gray-800 p-4 sm:grid-cols-2 md:grid-cols-4 bg-white dark:bg-gray-900">
          <div className="space-y-xs">
            <Label htmlFor="user-filter">User</Label>
            <Select
              value={filters.userId?.toString() || ""}
              onValueChange={(value) => updateFilter("userId", value ? Number.parseInt(value) : undefined)}
            >
              <SelectTrigger id="user-filter">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-xs">
            <Label htmlFor="action-filter">Action Type</Label>
            <Select value={filters.action || ""} onValueChange={(value) => updateFilter("action", value || undefined)}>
              <SelectTrigger id="action-filter">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-xs">
            <Label htmlFor="date-from">Date From</Label>
            <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-from"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(new Date(filters.dateFrom), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                  onSelect={(date) => {
                    updateFilter("dateFrom", date ? format(date, "yyyy-MM-dd") : undefined)
                    setDateFromOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-xs">
            <Label htmlFor="date-to">Date To</Label>
            <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-to"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(new Date(filters.dateTo), "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                  onSelect={(date) => {
                    updateFilter("dateTo", date ? format(date, "yyyy-MM-dd") : undefined)
                    setDateToOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}
