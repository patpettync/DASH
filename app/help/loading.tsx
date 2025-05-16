import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui-core/skeleton"

export default function HelpLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Search bar skeleton */}
      <div className="w-full max-w-md mx-auto mb-8">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Quick reference guides skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle>
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6 mb-4" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
