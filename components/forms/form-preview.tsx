"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FormField } from "@/types/forms"
import { useToast } from "@/hooks/use-toast"

interface FormPreviewProps {
  title: string
  description: string
  fields: FormField[]
}

export function FormPreview({ title, description, fields }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    // Clear error when user types
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = "This field is required"
      }

      if (field.type === "email" && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        newErrors[field.id] = "Please enter a valid email address"
      }

      if (
        field.type === "url" &&
        formData[field.id] &&
        !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData[field.id])
      ) {
        newErrors[field.id] = "Please enter a valid URL"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // This would typically submit to a server
      console.log("Form data:", formData)
      toast({
        title: "Form submitted",
        description: "Your form has been submitted successfully.",
      })
    } else {
      toast({
        title: "Form validation failed",
        description: "Please check the form for errors.",
        variant: "destructive",
      })
    }
  }

  const renderField = (field: FormField) => {
    const error = errors[field.id]

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "phone":
      case "url":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {field.helpText && !error && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case "textarea":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={error ? "border-destructive" : ""}
            />
            {field.helpText && !error && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="flex">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id} className={error ? "border-destructive" : ""}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, i) => (
                  <SelectItem key={i} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && !error && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={formData[field.id] || false}
                onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              />
              <Label htmlFor={field.id} className="flex">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            {field.helpText && !error && <p className="text-sm text-muted-foreground">{field.helpText}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No fields added yet. Add fields in the Build tab.</p>
            </div>
          ) : (
            fields.map((field) => <div key={field.id}>{renderField(field)}</div>)
          )}
        </form>
      </CardContent>
      {fields.length > 0 && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
