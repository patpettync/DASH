"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui-core/toast"
import { Pencil, Save, X } from "lucide-react"

// Form schema with validation - removed bio field
const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInfoCardProps {
  user: {
    name: string
    email: string
    phone?: string
    authType: string
  }
  onUpdateUser: (data: Partial<PersonalInfoFormValues>) => void
  className?: string
}

export function PersonalInfoCard({ user, onUpdateUser, className }: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  const isOffice365User = user.authType === "office365"

  // Initialize form with user data
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    },
  })

  // Handle form submission
  function onSubmit(data: PersonalInfoFormValues) {
    // Simulate API call
    setTimeout(() => {
      onUpdateUser(data)
      setIsEditing(false)
      toast.addToast({
        title: "Profile updated",
        description: "Your personal information has been updated successfully.",
        variant: "success",
      })
    }, 500)
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-8">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
        <CardDescription>Manage your personal information and contact details.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || (isOffice365User && field.name === "name")}
                      className={isOffice365User && field.name === "name" ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {isOffice365User && field.name === "name" && (
                    <FormDescription>This field is managed by your Office 365 account.</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={!isEditing || isOffice365User}
                      className={isOffice365User ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {isOffice365User && (
                    <FormDescription>This field is managed by your Office 365 account.</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  form.reset()
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}
