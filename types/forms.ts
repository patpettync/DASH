export interface FormFieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  helpText?: string
  options?: FormFieldOption[]
  // Additional field-specific properties can be added here
}

export interface Form {
  id: string
  title: string
  description?: string
  fields: FormField[]
  settings: {
    collectEmail: boolean
    limitResponses: boolean
    responseLimit?: number
    notifyOnSubmission: boolean
    confirmationMessage: string
    redirectAfterSubmission: boolean
    redirectUrl?: string
    theme: string
    allowMultipleResponses: boolean
    showProgressBar: boolean
  }
  createdAt: string
  updatedAt: string
  published: boolean
  responseCount: number
}

export interface FormResponse {
  id: string
  formId: string
  respondent?: string
  data: Record<string, any>
  submittedAt: string
  status: "complete" | "partial"
  metadata?: {
    browser?: string
    os?: string
    device?: string
    ipAddress?: string
    timeToComplete?: number
  }
}
