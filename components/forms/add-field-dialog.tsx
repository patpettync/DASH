"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Type, AlignLeft, ListChecks, CheckSquare, Calendar, Upload, Mail, Phone, Globe, Hash } from "lucide-react"
import type { FormField } from "@/types/forms"

interface FieldTypeOption {
  type: string
  label: string
  icon: React.ReactNode
  description: string
}

const fieldTypes: FieldTypeOption[] = [
  {
    type: "text",
    label: "Text",
    icon: <Type className="h-5 w-5" />,
    description: "Short text input for names, titles, etc.",
  },
  {
    type: "textarea",
    label: "Paragraph",
    icon: <AlignLeft className="h-5 w-5" />,
    description: "Longer text input for descriptions, comments, etc.",
  },
  {
    type: "select",
    label: "Dropdown",
    icon: <ListChecks className="h-5 w-5" />,
    description: "Select from a list of options",
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    icon: <CheckSquare className="h-5 w-5" />,
    description: "Select multiple options",
  },
  {
    type: "date",
    label: "Date",
    icon: <Calendar className="h-5 w-5" />,
    description: "Date picker",
  },
  {
    type: "file",
    label: "File Upload",
    icon: <Upload className="h-5 w-5" />,
    description: "Allow file uploads",
  },
  {
    type: "email",
    label: "Email",
    icon: <Mail className="h-5 w-5" />,
    description: "Email address input with validation",
  },
  {
    type: "phone",
    label: "Phone",
    icon: <Phone className="h-5 w-5" />,
    description: "Phone number input",
  },
  {
    type: "url",
    label: "Website",
    icon: <Globe className="h-5 w-5" />,
    description: "URL input with validation",
  },
  {
    type: "number",
    label: "Number",
    icon: <Hash className="h-5 w-5" />,
    description: "Numeric input",
  },
]

interface AddFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddField: (field: FormField) => void
}

export function AddFieldDialog({ open, onOpenChange, onAddField }: AddFieldDialogProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [fieldLabel, setFieldLabel] = useState("")

  const handleAddField = () => {
    if (!selectedType) return

    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: selectedType,
      label: fieldLabel || `New ${selectedType} field`,
      required: false,
      placeholder: "",
      helpText: "",
      options:
        selectedType === "select"
          ? [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]
          : undefined,
    }

    onAddField(newField)
    setSelectedType(null)
    setFieldLabel("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Form Field</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedType ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="field-label">Field Label</Label>
                <Input
                  id="field-label"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  placeholder={`New ${selectedType} field`}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedType(null)}>
                  Back
                </Button>
                <Button onClick={handleAddField}>Add Field</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {fieldTypes.map((fieldType) => (
                <Button
                  key={fieldType.type}
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-start p-4 space-y-2 text-left"
                  onClick={() => setSelectedType(fieldType.type)}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    {fieldType.icon}
                  </div>
                  <div className="font-medium">{fieldType.label}</div>
                  <div className="text-sm text-muted-foreground">{fieldType.description}</div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
