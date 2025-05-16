"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { ClickTestUtility } from "@/components/ui-core/click-test-utility"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function TestClickabilityPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbLink href="/dashboard/test-clickability" className="font-medium">
                Test Clickability
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">Icon Clickability Test</h1>
            <p className="mb-6">
              Use this page to test the clickability of the header icons. Click the "Start Click Test" button in the
              bottom right corner to begin testing. Then click on the notification and profile icons to verify that the
              entire icon area is clickable.
            </p>
            <div className="p-4 bg-yellow-100 rounded-md">
              <h2 className="font-bold mb-2">Instructions:</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click the "Start Click Test" button</li>
                <li>Click on different parts of the notification icon (top, middle, bottom)</li>
                <li>Verify that the dropdown opens regardless of where you click</li>
                <li>Close the dropdown by clicking elsewhere</li>
                <li>Repeat the test with the profile icon</li>
                <li>When finished, click "Stop Test"</li>
              </ol>
            </div>
          </div>
        </div>
        <ClickTestUtility />
      </div>
    </MainLayout>
  )
}
