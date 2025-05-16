"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface DateInputProps {
  id: string
  label: string
  value?: Date
  onChange?: (date: Date | null) => void
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
}

export function DateInput({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className,
}: DateInputProps) {
  const [day, setDay] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [year, setYear] = useState<string>("")

  // Initialize from value
  useEffect(() => {
    if (value) {
      setDay(value.getDate().toString().padStart(2, "0"))
      setMonth((value.getMonth() + 1).toString().padStart(2, "0"))
      setYear(value.getFullYear().toString())
    }
  }, [value])

  // Update parent when values change
  useEffect(() => {
    if (day && month && year) {
      const newDate = new Date(`${year}-${month}-${day}`)
      if (!isNaN(newDate.getTime()) && onChange) {
        onChange(newDate)
      }
    }
  }, [day, month, year, onChange])

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 31)) {
      setDay(value)
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value === "" || (Number.parseInt(value) >= 1 && Number.parseInt(value) <= 12)) {
      setMonth(value)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value === "" || (Number.parseInt(value) >= 1900 && Number.parseInt(value) <= 2100)) {
      setYear(value)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-right block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex gap-2">
        <div className="w-1/4">
          <Input
            id={`${id}-day`}
            type="text"
            placeholder="DD"
            value={day}
            onChange={handleDayChange}
            maxLength={2}
            disabled={disabled}
            className="h-lg text-center"
          />
          <Label htmlFor={`${id}-day`} className="text-xs text-center block mt-1">
            Day
          </Label>
        </div>
        <div className="w-1/4">
          <Input
            id={`${id}-month`}
            type="text"
            placeholder="MM"
            value={month}
            onChange={handleMonthChange}
            maxLength={2}
            disabled={disabled}
            className="h-lg text-center"
          />
          <Label htmlFor={`${id}-month`} className="text-xs text-center block mt-1">
            Month
          </Label>
        </div>
        <div className="w-2/4">
          <Input
            id={`${id}-year`}
            type="text"
            placeholder="YYYY"
            value={year}
            onChange={handleYearChange}
            maxLength={4}
            disabled={disabled}
            className="h-lg text-center"
          />
          <Label htmlFor={`${id}-year`} className="text-xs text-center block mt-1">
            Year
          </Label>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
