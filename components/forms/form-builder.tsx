"use client"

import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FormFieldItem } from "./form-field-item"
import { AddFieldDialog } from "./add-field-dialog"
import type { FormField } from "@/types/forms"

interface FormBuilderProps {
  fields: FormField[]
  onFieldsChange: (fields: FormField[]) => void
}

export function FormBuilder({ fields, onFieldsChange }: FormBuilderProps) {
  const [showAddField, setShowAddField] = useState(false)
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)

      onFieldsChange(arrayMove(fields, oldIndex, newIndex))
    }
  }

  const handleAddField = (field: FormField) => {
    onFieldsChange([...fields, field])
    setShowAddField(false)
  }

  const handleUpdateField = (index: number, updatedField: FormField) => {
    const newFields = [...fields]
    newFields[index] = updatedField
    onFieldsChange(newFields)
  }

  const handleDeleteField = (index: number) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    onFieldsChange(newFields)
  }

  const handleDuplicateField = (index: number) => {
    const fieldToDuplicate = fields[index]
    const duplicatedField = {
      ...fieldToDuplicate,
      id: `field-${Date.now()}`,
      label: `${fieldToDuplicate.label} (Copy)`,
    }
    const newFields = [...fields]
    newFields.splice(index + 1, 0, duplicatedField)
    onFieldsChange(newFields)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          {fields.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your form is empty. Add your first field to get started.</p>
              <Button onClick={() => setShowAddField(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <FormFieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      isSelected={selectedFieldIndex === index}
                      onSelect={() => setSelectedFieldIndex(index === selectedFieldIndex ? null : index)}
                      onUpdate={(updatedField) => handleUpdateField(index, updatedField)}
                      onDelete={() => handleDeleteField(index)}
                      onDuplicate={() => handleDuplicateField(index)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => setShowAddField(true)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <AddFieldDialog open={showAddField} onOpenChange={setShowAddField} onAddField={handleAddField} />
    </div>
  )
}
