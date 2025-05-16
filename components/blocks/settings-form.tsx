"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/ui-core/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SettingsFormProps {
  className?: string
}

export function SettingsForm({ className }: SettingsFormProps) {
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
    plan: "monthly",
    billingInterval: "monthly",
    streetAddress: "123 Main St",
    city: "New York",
    province: "NY",
    zipCode: "10001",
    country: "USA",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className={className}>
      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField id="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormField id="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your billing preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan" className="text-sm font-medium text-right block mb-2">
                  Plan
                </Label>
                <Select value={formData.plan} onValueChange={(value) => handleSelectChange("plan", value)}>
                  <SelectTrigger id="plan" className="h-lg">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billingInterval" className="text-sm font-medium text-right block mb-2">
                  Billing Interval
                </Label>
                <Select
                  value={formData.billingInterval}
                  onValueChange={(value) => handleSelectChange("billingInterval", value)}
                >
                  <SelectTrigger id="billingInterval" className="h-lg">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Address</CardTitle>
            <CardDescription>Manage your business address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              id="streetAddress"
              label="Street Address"
              value={formData.streetAddress}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField id="city" label="City" value={formData.city} onChange={handleChange} />
              <FormField id="province" label="Province" value={formData.province} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField id="zipCode" label="ZIP/Postal Code" value={formData.zipCode} onChange={handleChange} />
              <FormField id="country" label="Country" value={formData.country} onChange={handleChange} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Update</Button>
        </div>
      </form>
    </div>
  )
}
