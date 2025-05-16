import { GridSystemDemo } from "@/components/ui-core/grid-system-demo"

export default function GridSystemPage() {
  return (
    <div className="container space-y-lg">
      <div className="mb-lg">
        <h1 className="text-3xl font-bold mb-2">Grid System</h1>
        <p className="text-muted-foreground">Demonstration of the responsive 8px-based grid and margin strategy.</p>
      </div>

      <GridSystemDemo />
    </div>
  )
}
