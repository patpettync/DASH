import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui-core/skeleton"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { settingsTabs } from "@/lib/settings-tabs"

interface SettingsLoadingSkeletonProps {
  variant?: "default" | "table" | "filters"
}

export function SettingsLoadingSkeleton({ variant = "default" }: SettingsLoadingSkeletonProps) {
  return (
    <ModuleLayout moduleName="System Settings" tabs={settingsTabs} basePath="/settings">
      <div className="space-y-6">
        {/* Tab selector skeleton */}
        <div className="grid w-full grid-cols-2 mb-4">
          <Skeleton className="h-10 rounded-l-md" />
          <Skeleton className="h-10 rounded-r-md" />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>
                <Skeleton className="h-7 w-24" />
              </CardTitle>
              <Skeleton className="h-9 w-28" />
            </div>
            <CardDescription>
              <Skeleton className="h-5 w-full max-w-md" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            {variant === "filters" && (
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative flex-1">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="w-full">
                  <div className="grid w-full grid-cols-3">
                    <Skeleton className="h-10 rounded-l-md" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10 rounded-r-md" />
                  </div>
                </div>
              </div>
            )}

            {variant === "default" && (
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            )}

            <div className="border rounded-md">
              <div className="p-2">
                <Skeleton className="h-10 w-full mb-2" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full mb-2" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  )
}
