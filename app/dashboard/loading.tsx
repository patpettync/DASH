import { Skeleton } from "@/components/ui-core/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Welcome header skeleton */}
      <div className="flex justify-center mb-8">
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Core Modules section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`core-${i}`} className="h-40 rounded-lg" />
            ))}
        </div>
      </div>

      {/* Admin section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`admin-${i}`} className="h-40 rounded-lg" />
            ))}
        </div>
      </div>

      {/* Coming Soon section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`soon-${i}`} className="h-40 rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  )
}
