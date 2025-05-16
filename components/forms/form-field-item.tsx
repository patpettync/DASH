"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Trash, Copy, ChevronDown, ChevronUp } from "lucide-react"
import type { FormField } from "@/types/forms"

interface FormFieldItemProps {
  field: FormField
  index: number
  isSelected: boolean
  onSelect: () => void
  onUpdate: (field: FormField) => void
  onDelete: () => void
  onDuplicate: () => void
}

export function FormFieldItem({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: FormFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...field, label: e.target.value })
  }

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ ...field, required: checked })
  }

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...field, placeholder: e.target.value })
  }

  const handleHelpTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...field, helpText: e.target.value })
  }

  const renderFieldPreview = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "phone":
      case "url":
        return <Input type={field.type} placeholder={field.placeholder || `Enter ${field.label}`} disabled />
      case "textarea":
        return <Textarea placeholder={field.placeholder || `Enter ${field.label}`} disabled />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
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
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-xs">
            <Checkbox id={`preview-${field.id}`} disabled />
            <label
              htmlFor={`preview-${field.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )
      default:
        return <Input disabled />
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className={`${isSelected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="p-sm flex flex-row items-center justify-between border-b">
        <div className="flex items-center space-x-xs">
          <div {...attributes} {...listeners} className="cursor-grab p-xs rounded-md hover:bg-muted">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="font-medium">{field.type.charAt(0).toUpperCase() + field.type.slice(1)}</span>
        </div>
        <div className="flex items-center space-x-xs">
          <Button variant="ghost" size="icon" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSelect}>
            {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-sm">
        <div className="space-y-sm">
          <div className="flex items-start space-x-xs">
            <div className="flex-1">
              <Label htmlFor={`label-${field.id}`}>Field Label</Label>
              <Input id={`label-${field.id}`} value={field.label} onChange={handleLabelChange} />
            </div>
            <div className="pt-6">
              <div className="flex items-center space-x-xs">
                <Switch id={`required-${field.id}`} checked={field.required} onCheckedChange={handleRequiredChange} />
                <Label htmlFor={`required-${field.id}`}>Required</Label>
              </div>
            </div>
          </div>

          {isSelected && (
            <div className="space-y-sm pt-xs">
              <div>
                <Label htmlFor={`placeholder-${field.id}`}>Placeholder</Label>
                <Input
                  id={`placeholder-${field.id}`}
                  value={field.placeholder || ""}
                  onChange={handlePlaceholderChange}
                  placeholder="Enter placeholder text"
                />
              </div>
              <div>
                <Label htmlFor={`help-${field.id}`}>Help Text</Label>
                <Input
                  id={`help-${field.id}`}
                  value={field.helpText || ""}
                  onChange={handleHelpTextChange}
                  placeholder="Enter help text"
                />
              </div>
              {/* Additional field-specific settings would go here */}
            </div>
          )}

          <div className="pt-xs">
            {renderFieldPreview()}
            {field.helpText && <p className="text-sm text-muted-foreground mt-xs">{field.helpText}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
