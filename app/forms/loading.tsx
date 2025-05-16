import { Skeleton } from "@/components/ui-core/skeleton"

export default function FormsRootLoading() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
