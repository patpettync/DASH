import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FormAnalyticsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Back button and form name header skeleton */}
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Header section with filters skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-[120px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full mb-4" />
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-4 w-8 mx-auto mb-2" />
                <Skeleton className="h-6 w-6 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
