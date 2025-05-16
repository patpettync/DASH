"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui-core/toast"
import { Modal, ConfirmationModal, useModal, ModalProvider } from "@/components/ui-core/modal"
import { CardSkeleton, TableSkeleton, FormSkeleton, DashboardSkeleton } from "@/components/ui-core/skeleton"
import { ConfirmationPopover } from "@/components/ui-core/confirmation-popover"
import { Trash, Info, AlertTriangle, CheckCircle, Bell } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function UIComponentsDemo() {
  const { addToast } = useToast()
  const { openModal } = useModal()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Toggle loading state for skeletons demo
  const toggleLoading = () => {
    setIsLoading((prev) => !prev)
    if (!isLoading) {
      // Auto reset after 3 seconds
      setTimeout(() => setIsLoading(false), 3000)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">UI Components</h1>
        <p className="text-muted-foreground">Reusable UI components for the DASH platform.</p>
      </div>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>Display temporary notifications to users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                addToast({
                  title: "Success",
                  description: "Operation completed successfully.",
                  variant: "success",
                })
              }
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Success Toast
            </Button>
            <Button
              onClick={() =>
                addToast({
                  title: "Error",
                  description: "An error occurred. Please try again.",
                  variant: "error",
                })
              }
              variant="destructive"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Error Toast
            </Button>
            <Button
              onClick={() =>
                addToast({
                  title: "Warning",
                  description: "This action might have consequences.",
                  variant: "warning",
                })
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Warning Toast
            </Button>
            <Button
              onClick={() =>
                addToast({
                  title: "Information",
                  description: "Here's some information you might find useful.",
                  variant: "info",
                })
              }
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              Info Toast
            </Button>
            <Button
              onClick={() =>
                addToast({
                  title: "Notification",
                  description: "You have a new notification.",
                  action: <Button size="sm">View</Button>,
                })
              }
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              With Action
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Card>
        <CardHeader>
          <CardTitle>Modals</CardTitle>
          <CardDescription>Display dialogs and popovers for user interactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Button
              onClick={() =>
                openModal({
                  title: "Modal from Context",
                  description: "This modal was opened using the modal context.",
                  children: <p className="py-4">Modal content goes here.</p>,
                  footer: (
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  ),
                })
              }
              variant="secondary"
            >
              Context Modal
            </Button>
            <Button onClick={() => setIsConfirmModalOpen(true)} variant="destructive">
              Confirmation Modal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading Skeletons */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Skeletons</CardTitle>
          <CardDescription>Display loading states for various components.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={toggleLoading} variant="outline">
              {isLoading ? "Stop Loading" : "Show Loading State"}
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <TableSkeleton rows={3} />
              <FormSkeleton />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Card Skeleton</h3>
                  <CardSkeleton className="h-40" />
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Table Skeleton</h3>
                  <TableSkeleton rows={2} className="h-40" />
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Form Skeleton</h3>
                  <FormSkeleton fields={2} className="h-40" />
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Dashboard Skeleton</h3>
                <DashboardSkeleton />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Popovers */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Popovers</CardTitle>
          <CardDescription>Request confirmation before performing destructive actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ConfirmationPopover
              title="Delete Item"
              description="Are you sure you want to delete this item? This action cannot be undone."
              onConfirm={() => addToast({ title: "Item deleted", variant: "success" })}
              variant="danger"
            >
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash className="h-4 w-4" />
                Delete Item
              </Button>
            </ConfirmationPopover>

            <ConfirmationPopover
              title="Archive Item"
              description="Are you sure you want to archive this item? You can restore it later."
              onConfirm={() => addToast({ title: "Item archived", variant: "success" })}
              variant="warning"
              confirmText="Archive"
            >
              <Button variant="outline" className="flex items-center gap-2">
                Archive Item
              </Button>
            </ConfirmationPopover>

            <ConfirmationPopover
              title="Publish Changes"
              description="Are you sure you want to publish these changes? They will be visible to all users."
              onConfirm={() => addToast({ title: "Changes published", variant: "success" })}
              confirmText="Publish"
            >
              <Button variant="default" className="flex items-center gap-2">
                Publish Changes
              </Button>
            </ConfirmationPopover>
          </div>
        </CardContent>
      </Card>

      {/* Modal Examples */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        description="This is an example modal dialog"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Save Changes</Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-slate-600">
            This is the content of the modal. You can put any components or content here.
          </p>
          <div className="mt-4 p-4 bg-slate-50 rounded-md">
            <p className="text-sm">This could be a form, details, or any other content.</p>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the item and remove the data from our servers."
        onConfirm={() => {
          addToast({
            title: "Item deleted",
            description: "The item has been permanently deleted.",
            variant: "success",
          })
        }}
        variant="danger"
        confirmText="Delete"
      />
    </div>
  )
}

// Wrap the component with providers and the new layout
export default function UIComponentsPage() {
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
              <BreadcrumbLink href="/dashboard/ui-components" className="font-medium">
                UI Components
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ModalProvider>
          <UIComponentsDemo />
        </ModalProvider>
      </div>
    </MainLayout>
  )
}
