"use client"
import type { TabItem } from "@/components/layouts/module-tabs"

// Define module tabs for the Forms module - updated to use Field Sets instead of Analytics
const formsTabs: TabItem[] = [
  { href: "/forms/forms", label: "FORMS", exact: true },
  { href: "/forms/field-sets", label: "FIELD SETS" },
]

// Sample form data for analytics
const sampleForms = [
  {
    id: "1",
    name: "Customer Feedback Form",
    responses: 245,
    completionRate: 78,
    avgTimeToComplete: "3:24",
    dailyResponses: [12, 15, 8, 21, 18, 25, 19],
    questionCompletion: [
      { question: "How satisfied are you with our service?", completion: 98 },
      { question: "Would you recommend us to others?", completion: 95 },
      { question: "What improvements would you suggest?", completion: 72 },
      { question: "How long have you been our customer?", completion: 89 },
      { question: "Any additional comments?", completion: 45 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 15 },
        { group: "25-34", percentage: 32 },
        { group: "35-44", percentage: 28 },
        { group: "45-54", percentage: 18 },
        { group: "55+", percentage: 7 },
      ],
      device: [
        { type: "Mobile", percentage: 64 },
        { type: "Desktop", percentage: 31 },
        { type: "Tablet", percentage: 5 },
      ],
    },
  },
  {
    id: "2",
    name: "Event Registration",
    responses: 156,
    completionRate: 92,
    avgTimeToComplete: "4:12",
    dailyResponses: [8, 12, 15, 22, 25, 18, 10],
    questionCompletion: [
      { question: "Will you attend in person?", completion: 100 },
      { question: "Dietary restrictions?", completion: 88 },
      { question: "Which sessions interest you?", completion: 95 },
      { question: "Need accommodation?", completion: 82 },
      { question: "Additional guests?", completion: 76 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 8 },
        { group: "25-34", percentage: 25 },
        { group: "35-44", percentage: 35 },
        { group: "45-54", percentage: 22 },
        { group: "55+", percentage: 10 },
      ],
      device: [
        { type: "Mobile", percentage: 48 },
        { type: "Desktop", percentage: 47 },
        { type: "Tablet", percentage: 5 },
      ],
    },
  },
  {
    id: "3",
    name: "Job Application",
    responses: 42,
    completionRate: 65,
    avgTimeToComplete: "12:35",
    dailyResponses: [3, 5, 4, 8, 7, 9, 6],
    questionCompletion: [
      { question: "Contact information", completion: 100 },
      { question: "Work experience", completion: 92 },
      { question: "Education", completion: 88 },
      { question: "Skills assessment", completion: 62 },
      { question: "References", completion: 45 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 22 },
        { group: "25-34", percentage: 45 },
        { group: "35-44", percentage: 25 },
        { group: "45-54", percentage: 6 },
        { group: "55+", percentage: 2 },
      ],
      device: [
        { type: "Mobile", percentage: 35 },
        { type: "Desktop", percentage: 62 },
        { type: "Tablet", percentage: 3 },
      ],
    },
  },
  {
    id: "4",
    name: "Product Survey",
    responses: 89,
    completionRate: 71,
    avgTimeToComplete: "5:48",
    dailyResponses: [5, 8, 12, 15, 18, 16, 15],
    questionCompletion: [
      { question: "How did you hear about us?", completion: 95 },
      { question: "Product satisfaction rating", completion: 92 },
      { question: "Features you use most", completion: 85 },
      { question: "Missing features", completion: 78 },
      { question: "Would you buy again?", completion: 68 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 18 },
        { group: "25-34", percentage: 35 },
        { group: "35-44", percentage: 28 },
        { group: "45-54", percentage: 12 },
        { group: "55+", percentage: 7 },
      ],
      device: [
        { type: "Mobile", percentage: 52 },
        { type: "Desktop", percentage: 42 },
        { type: "Tablet", percentage: 6 },
      ],
    },
  },
  {
    id: "5",
    name: "Conference Feedback",
    responses: 112,
    completionRate: 84,
    avgTimeToComplete: "4:15",
    dailyResponses: [22, 35, 28, 15, 8, 4, 0],
    questionCompletion: [
      { question: "Overall satisfaction", completion: 98 },
      { question: "Speaker ratings", completion: 92 },
      { question: "Venue feedback", completion: 88 },
      { question: "Session feedback", completion: 85 },
      { question: "Suggestions for next year", completion: 65 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 12 },
        { group: "25-34", percentage: 28 },
        { group: "35-44", percentage: 32 },
        { group: "45-54", percentage: 18 },
        { group: "55+", percentage: 10 },
      ],
      device: [
        { type: "Mobile", percentage: 58 },
        { type: "Desktop", percentage: 32 },
        { type: "Tablet", percentage: 10 },
      ],
    },
  },
]

import { redirect } from "next/navigation"

export default function AnalyticsRedirect({ params }: { params: { id: string } }) {
  redirect(`/forms/forms/${params.id}`)
}
