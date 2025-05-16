import { BrandColorTest } from "@/components/ui-core/brand-color-test"

export default function BrandTestPage() {
  return (
    <div className="container-layout py-8">
      <h1 className="text-2xl font-bold mb-6">Brand Color System Test</h1>
      <p className="mb-6">
        This page tests the brand color system to ensure that colors are being applied correctly across the application
        and persisting between page loads.
      </p>

      <div className="space-y-8">
        <BrandColorTest />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 text-brand-primary">Text with Brand Primary</h2>
            <p className="mb-4">
              This text uses the standard text color, but the heading uses the brand primary color.
            </p>
            <div className="h-1 w-full bg-brand-primary mb-4"></div>
            <p className="text-brand-secondary">This text uses the brand secondary color.</p>
          </div>

          <div className="p-6 rounded-lg bg-brand-primary text-white">
            <h2 className="text-xl font-bold mb-4">Content on Brand Primary</h2>
            <p className="mb-4">This content is displayed on top of the brand primary color background.</p>
            <div className="h-1 w-full bg-white mb-4"></div>
            <p className="bg-brand-primary-20 p-2 rounded">This has a semi-transparent background.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
