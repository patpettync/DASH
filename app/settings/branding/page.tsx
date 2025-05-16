"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Check, Upload, AlertCircle, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui-core/toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui-core/skeleton"
import { useBrand } from "@/contexts/brand-context"
import { settingsTabs } from "@/lib/settings-tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateSvg, svgToDataUrl } from "@/lib/svg-validator"
import Image from "next/image"

// SVG Logo component for preview
const LogoSvg = ({ color = "var(--brand-primary)" }: { color?: string }) => (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 26C16.686 26 14 23.314 14 20C14 16.686 16.686 14 20 14C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26Z"
      fill={color}
      style={{ transition: "fill var(--transition-color)" }}
    />
    <path
      d="M40 20H44M48 20H52M56 20H60M64 20H68M72 20H76M80 20H84M88 20H92M96 20H100M104 20H108"
      stroke={color}
      strokeWidth="2"
      style={{ transition: "stroke var(--transition-color)" }}
    />
    <path
      d="M40 15V25M50 15V25M60 15V25M70 15V25M80 15V25M90 15V25M100 15V25M110 15V25"
      stroke={color}
      strokeWidth="2"
      style={{ transition: "stroke var(--transition-color)" }}
    />
  </svg>
)

// SVG Favicon component for preview
const FaviconSvg = ({ color = "var(--brand-primary)" }: { color?: string }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="15" fill={color} style={{ transition: "fill var(--transition-color)" }} />
    <path
      d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM20 26C16.686 26 14 23.314 14 20C14 16.686 16.686 14 20 14C23.314 14 26 16.686 26 20C26 23.314 23.314 26 20 26Z"
      fill="white"
    />
  </svg>
)

// Helper function to validate hex color
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

// Preset colors
const PRIMARY_PRESETS = ["#6837F1", "#3A86FF", "#FF006E", "#FB5607", "#8338EC", "#3A0CA3", "#4361EE"]
const SECONDARY_PRESETS = ["#3A86FF", "#6837F1", "#00B4D8", "#06D6A0", "#FFD166", "#F72585", "#4CC9F0"]

export default function BrandingPage() {
  const { addToast } = useToast()
  const { colors, logoUrl, faviconUrl, updateColors, updateLogo, updateFavicon } = useBrand()

  const [activeTab, setActiveTab] = useState("invoice")

  // Modal states
  const [logoModalOpen, setLogoModalOpen] = useState(false)
  const [faviconModalOpen, setFaviconModalOpen] = useState(false)
  const [primaryColorModalOpen, setPrimaryColorModalOpen] = useState(false)
  const [secondaryColorModalOpen, setSecondaryColorModalOpen] = useState(false)

  // Upload states
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [faviconUploading, setFaviconUploading] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [faviconError, setFaviconError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  // Refs for file inputs
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  // Temporary color values for modals
  const [tempPrimaryColor, setTempPrimaryColor] = useState(colors.primary)
  const [tempSecondaryColor, setTempSecondaryColor] = useState(colors.secondary)

  // For custom color inputs
  const [primaryInputValue, setPrimaryInputValue] = useState(colors.primary)
  const [secondaryInputValue, setSecondaryInputValue] = useState(colors.secondary)
  const [primaryInputError, setPrimaryInputError] = useState(false)
  const [secondaryInputError, setSecondaryInputError] = useState(false)

  // Refs for color pickers
  const primaryColorPickerRef = useRef<HTMLInputElement>(null)
  const secondaryColorPickerRef = useRef<HTMLInputElement>(null)

  // Add state for confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {})
  const [confirmationTitle, setConfirmationTitle] = useState("")

  // Update temp colors when brand colors change
  useEffect(() => {
    setTempPrimaryColor(colors.primary)
    setTempSecondaryColor(colors.secondary)
    setPrimaryInputValue(colors.primary)
    setSecondaryInputValue(colors.secondary)
  }, [colors])

  // Reset logo states when modal closes
  useEffect(() => {
    if (!logoModalOpen) {
      setLogoFile(null)
      setLogoError(null)
      setLogoUploading(false)
      setLogoPreview(null)
    }
  }, [logoModalOpen])

  // Reset favicon states when modal closes
  useEffect(() => {
    if (!faviconModalOpen) {
      setFaviconFile(null)
      setFaviconError(null)
      setFaviconUploading(false)
      setFaviconPreview(null)
    }
  }, [faviconModalOpen])

  // Modify the handleLogoUpload function to show confirmation
  const handleLogoUpload = async () => {
    if (!logoFile) return

    // Set up confirmation dialog
    setConfirmationTitle("Update Logo")
    setConfirmationAction(() => async () => {
      setLogoUploading(true)
      setLogoError(null)

      try {
        // In a real application, you would upload the file to a server here
        // For this example, we'll just use the data URL
        const dataUrl = await svgToDataUrl(logoFile)

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update logo in context
        updateLogo(dataUrl)

        // Close modal and show success message
        setLogoModalOpen(false)
        addToast({
          title: "Logo updated",
          description: "Your logo has been updated successfully.",
          variant: "success",
        })
      } catch (error) {
        console.error("Error uploading logo:", error)
        setLogoError("Error uploading logo. Please try again.")
      } finally {
        setLogoUploading(false)
      }
    })

    // Open confirmation dialog
    setConfirmationOpen(true)
  }

  // Modify the handleFaviconUpload function to show confirmation
  const handleFaviconUpload = async () => {
    if (!faviconFile) return

    // Set up confirmation dialog
    setConfirmationTitle("Update Favicon")
    setConfirmationAction(() => async () => {
      setFaviconUploading(true)
      setFaviconError(null)

      try {
        // In a real application, you would upload the file to a server here
        // For this example, we'll just use the data URL
        const dataUrl = await svgToDataUrl(faviconFile)

        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Update favicon in context
        updateFavicon(dataUrl)

        // Close modal and show success message
        setFaviconModalOpen(false)
        addToast({
          title: "Favicon updated",
          description: "Your favicon has been updated successfully.",
          variant: "success",
        })
      } catch (error) {
        console.error("Error uploading favicon:", error)
        setFaviconError("Error uploading favicon. Please try again.")
      } finally {
        setFaviconUploading(false)
      }
    })

    // Open confirmation dialog
    setConfirmationOpen(true)
  }

  // Modify the handlePrimaryColorSave function to show confirmation
  const handlePrimaryColorSave = () => {
    if (isValidHexColor(primaryInputValue)) {
      // Set up confirmation dialog
      setConfirmationTitle("Update Primary Color")
      setConfirmationAction(() => () => {
        updateColors({ primary: primaryInputValue })
        setPrimaryColorModalOpen(false)
        setPrimaryInputError(false)
      })

      // Open confirmation dialog
      setConfirmationOpen(true)
    } else {
      setPrimaryInputError(true)
    }
  }

  // Modify the handleSecondaryColorSave function to show confirmation
  const handleSecondaryColorSave = () => {
    if (isValidHexColor(secondaryInputValue)) {
      // Set up confirmation dialog
      setConfirmationTitle("Update Secondary Color")
      setConfirmationAction(() => () => {
        updateColors({ secondary: secondaryInputValue })
        setSecondaryColorModalOpen(false)
        setSecondaryInputError(false)
      })

      // Open confirmation dialog
      setConfirmationOpen(true)
    } else {
      setSecondaryInputError(true)
    }
  }

  const handlePrimaryColorChange = (color: string) => {
    setTempPrimaryColor(color)
    setPrimaryInputValue(color)
    setPrimaryInputError(false)
  }

  const handleSecondaryColorChange = (color: string) => {
    setTempSecondaryColor(color)
    setSecondaryInputValue(color)
    setSecondaryInputError(false)
  }

  const handlePrimaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPrimaryInputValue(value)

    if (isValidHexColor(value)) {
      setTempPrimaryColor(value)
      setPrimaryInputError(false)
      if (primaryColorPickerRef.current) {
        primaryColorPickerRef.current.value = value
      }
    } else {
      setPrimaryInputError(true)
    }
  }

  const handleSecondaryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSecondaryInputValue(value)

    if (isValidHexColor(value)) {
      setTempSecondaryColor(value)
      setSecondaryInputError(false)
      if (secondaryColorPickerRef.current) {
        secondaryColorPickerRef.current.value = value
      }
    } else {
      setSecondaryInputError(true)
    }
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>, isSecondary = false) => {
    const color = e.target.value
    if (isSecondary) {
      setTempSecondaryColor(color)
      setSecondaryInputValue(color)
      setSecondaryInputError(false)
    } else {
      setTempPrimaryColor(color)
      setPrimaryInputValue(color)
      setPrimaryInputError(false)
    }
  }

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setLogoFile(file)
    setLogoError(null)

    // Validate SVG
    const validation = await validateSvg(file)
    if (!validation.valid) {
      setLogoError(validation.message || "Invalid SVG file")
      return
    }

    // Create preview
    try {
      const dataUrl = await svgToDataUrl(file)
      setLogoPreview(dataUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      setLogoError("Error creating preview. Please try again.")
    }
  }

  const handleFaviconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setFaviconFile(file)
    setFaviconError(null)

    // Validate SVG
    const validation = await validateSvg(file)
    if (!validation.valid) {
      setFaviconError(validation.message || "Invalid SVG file")
      return
    }

    // Create preview
    try {
      const dataUrl = await svgToDataUrl(file)
      setFaviconPreview(dataUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      setFaviconError("Error creating preview. Please try again.")
    }
  }

  const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleLogoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const file = files[0]
    setLogoFile(file)
    setLogoError(null)

    // Validate SVG
    const validation = await validateSvg(file)
    if (!validation.valid) {
      setLogoError(validation.message || "Invalid SVG file")
      return
    }

    // Create preview
    try {
      const dataUrl = await svgToDataUrl(file)
      setLogoPreview(dataUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      setLogoError("Error creating preview. Please try again.")
    }
  }

  const handleFaviconDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleFaviconDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const file = files[0]
    setFaviconFile(file)
    setFaviconError(null)

    // Validate SVG
    const validation = await validateSvg(file)
    if (!validation.valid) {
      setFaviconError(validation.message || "Invalid SVG file")
      return
    }

    // Create preview
    try {
      const dataUrl = await svgToDataUrl(file)
      setFaviconPreview(dataUrl)
    } catch (error) {
      console.error("Error creating preview:", error)
      setFaviconError("Error creating preview. Please try again.")
    }
  }

  return (
    <ModuleLayout moduleName="System Settings" tabs={settingsTabs} basePath="/settings">
      <div className="space-y-8">
        {/* Branding Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Logo Card */}
          <Card
            className="border relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => setLogoModalOpen(true)}
          >
            <CardContent className="p-4 h-40 flex items-center justify-center relative">
              <div className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center pointer-events-none">
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 h-10">
                  {logoUrl ? (
                    <Image
                      src={logoUrl || "/placeholder.svg"}
                      alt="Company Logo"
                      width={120}
                      height={40}
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <LogoSvg />
                  )}
                </div>
              </div>
              <div className="absolute bottom-2 left-2">
                <h3 className="font-medium text-sm">Logo</h3>
                <p className="text-xs text-muted-foreground">Full-sized logo</p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:8px_8px] opacity-50 pointer-events-none dark:bg-[radial-gradient(#333333_1px,transparent_1px)]"></div>
            </CardContent>
          </Card>

          {/* Favicon Card */}
          <Card
            className="border relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => setFaviconModalOpen(true)}
          >
            <CardContent className="p-4 h-40 flex items-center justify-center relative">
              <div className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center pointer-events-none">
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="mb-2 h-10">
                  {faviconUrl ? (
                    <Image
                      src={faviconUrl || "/placeholder.svg"}
                      alt="Favicon"
                      width={40}
                      height={40}
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <FaviconSvg />
                  )}
                </div>
              </div>
              <div className="absolute bottom-2 left-2">
                <h3 className="font-medium text-sm">Favicon</h3>
                <p className="text-xs text-muted-foreground">Logo icon (512×512px)</p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(#e0e0e0_1px,transparent_1px)] [background-size:8px_8px] opacity-50 pointer-events-none dark:bg-[radial-gradient(#333333_1px,transparent_1px)]"></div>
            </CardContent>
          </Card>

          {/* Primary Brand Color Card */}
          <Card
            className="border relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => setPrimaryColorModalOpen(true)}
          >
            <CardContent className="p-4 h-40 flex items-center justify-center relative">
              <div className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center pointer-events-none">
                <Edit2 className="h-4 w-4 text-white" />
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center bg-[var(--brand-primary)]"
                style={{
                  transition: "background-color var(--transition-color)",
                }}
              >
                <h2 className="text-white text-xl font-bold">{colors.primary}</h2>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <h3 className="font-medium text-sm text-white">Primary Color</h3>
                <p className="text-xs text-white/80">Brand primary</p>
              </div>
            </CardContent>
          </Card>

          {/* Secondary Brand Color Card */}
          <Card
            className="border relative overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => setSecondaryColorModalOpen(true)}
          >
            <CardContent className="p-4 h-40 flex items-center justify-center relative">
              <div className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center pointer-events-none">
                <Edit2 className="h-4 w-4 text-white" />
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center bg-[var(--brand-secondary)]"
                style={{
                  transition: "background-color var(--transition-color)",
                }}
              >
                <h2 className="text-white text-xl font-bold">{colors.secondary}</h2>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <h3 className="font-medium text-sm text-white">Secondary Color</h3>
                <p className="text-xs text-white/80">Brand secondary</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--brand-primary)]">Preview</h2>

          <Card>
            <CardContent className="p-0">
              <div className="border-b">
                <Tabs defaultValue="invoice" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="invoice"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[var(--brand-primary)] data-[state=active]:bg-transparent"
                    >
                      Invoice PDF
                    </TabsTrigger>
                    <TabsTrigger
                      value="form"
                      className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[var(--brand-primary)] data-[state=active]:bg-transparent"
                    >
                      Form
                    </TabsTrigger>
                  </TabsList>

                  {/* Invoice Preview */}
                  <TabsContent value="invoice" className="p-6">
                    <div className="bg-white rounded-lg shadow-sm border p-8 max-w-3xl mx-auto">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="h-8 w-32 mb-1">
                            <Skeleton
                              className="h-full w-full"
                              style={{
                                backgroundColor: `var(--brand-primary-20)`,
                                transition: "background-color var(--transition-color)",
                              }}
                            />
                          </div>
                          <Skeleton
                            className="h-4 w-24"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          {logoUrl ? (
                            <Image
                              src={logoUrl || "/placeholder.svg"}
                              alt="Company Logo"
                              width={120}
                              height={40}
                              className="h-10 w-auto object-contain"
                            />
                          ) : (
                            <LogoSvg />
                          )}
                          <Skeleton
                            className="h-6 w-32 ml-2"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <Skeleton
                            className="h-4 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <div>
                          <Skeleton
                            className="h-4 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton className="h-6 w-32" />
                        </div>
                      </div>

                      <div
                        className="h-1 w-full mb-8 bg-[var(--brand-primary)]"
                        style={{
                          opacity: 0.3,
                          transition: "background-color var(--transition-color)",
                        }}
                      />

                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <Skeleton
                            className="h-5 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div>
                          <Skeleton
                            className="h-5 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>

                      <Skeleton className="h-4 w-full mb-6" />

                      <div className="w-full mb-8">
                        <div className="flex justify-between mb-2">
                          <Skeleton
                            className="h-5 w-24"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton
                            className="h-5 w-24"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                        <Skeleton className="h-12 w-full mb-2" />
                        <div className="flex justify-end">
                          <Skeleton
                            className="h-10 w-32 bg-[var(--brand-primary)]"
                            style={{
                              opacity: 0.7,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Form Preview */}
                  <TabsContent value="form" className="p-6">
                    <div className="bg-white rounded-lg shadow-sm border p-8 max-w-3xl mx-auto">
                      <div className="flex justify-between items-center mb-8">
                        <div className="h-8 w-32">
                          <Skeleton
                            className="h-full w-full"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          {logoUrl ? (
                            <Image
                              src={logoUrl || "/placeholder.svg"}
                              alt="Company Logo"
                              width={120}
                              height={40}
                              className="h-10 w-auto object-contain"
                            />
                          ) : (
                            <LogoSvg />
                          )}
                          <Skeleton
                            className="h-6 w-32 ml-2"
                            style={{
                              backgroundColor: `var(--brand-primary-20)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <Skeleton
                            className="h-4 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton
                            className="h-10 w-full"
                            style={{
                              borderColor: "var(--brand-primary)",
                              opacity: 0.1,
                              borderWidth: "2px",
                              transition: "border-color var(--transition-color)",
                            }}
                          />
                        </div>

                        <div>
                          <Skeleton
                            className="h-4 w-32 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton
                            className="h-10 w-full"
                            style={{
                              borderColor: "var(--brand-primary)",
                              opacity: 0.1,
                              borderWidth: "2px",
                              transition: "border-color var(--transition-color)",
                            }}
                          />
                        </div>

                        <div>
                          <Skeleton
                            className="h-4 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton
                            className="h-10 w-full"
                            style={{
                              borderColor: "var(--brand-primary)",
                              opacity: 0.1,
                              borderWidth: "2px",
                              transition: "border-color var(--transition-color)",
                            }}
                          />
                        </div>

                        <div>
                          <Skeleton
                            className="h-4 w-24 mb-2"
                            style={{
                              backgroundColor: `var(--brand-secondary-10)`,
                              transition: "background-color var(--transition-color)",
                            }}
                          />
                          <Skeleton
                            className="h-24 w-full"
                            style={{
                              borderColor: "var(--brand-primary)",
                              opacity: 0.1,
                              borderWidth: "2px",
                              transition: "border-color var(--transition-color)",
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div
                          className="h-10 w-24 rounded-md flex items-center justify-center bg-[var(--brand-primary)]"
                          style={{
                            transition: "background-color var(--transition-color)",
                          }}
                        >
                          <Skeleton className="h-4 w-16" style={{ backgroundColor: "white", opacity: 0.7 }} />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logo Upload Modal */}
      <Dialog open={logoModalOpen} onOpenChange={setLogoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--brand-primary)]">Upload Logo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                logoError ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleLogoDragOver}
              onDrop={handleLogoDrop}
            >
              {logoError ? (
                <div className="text-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                  <p className="text-sm text-red-500 font-medium">{logoError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogoFile(null)
                      setLogoError(null)
                      setLogoPreview(null)
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : logoPreview ? (
                <div className="text-center space-y-4">
                  <div className="relative w-full h-20 flex items-center justify-center">
                    <Image
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo Preview"
                      width={120}
                      height={40}
                      className="h-full w-auto object-contain"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLogoFile(null)
                        setLogoPreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">SVG file ready to upload</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Drag and drop your SVG logo file here, or click to browse
                  </p>
                  <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                    Select SVG File
                  </Button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".svg"
                    className="hidden"
                    onChange={handleLogoFileChange}
                  />
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended format: SVG. Maximum size: 2MB. The logo will be used throughout the application.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogoModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogoUpload} disabled={!logoFile || !!logoError || logoUploading} variant="brand">
              {logoUploading ? (
                <>
                  <span className="mr-2">Uploading...</span>
                  <span className="animate-spin">⟳</span>
                </>
              ) : (
                "Upload Logo"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Favicon Upload Modal */}
      <Dialog open={faviconModalOpen} onOpenChange={setFaviconModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--brand-primary)]">Upload Favicon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
                faviconError ? "border-red-500 bg-red-50 dark:bg-red-950/20" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleFaviconDragOver}
              onDrop={handleFaviconDrop}
            >
              {faviconError ? (
                <div className="text-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                  <p className="text-sm text-red-500 font-medium">{faviconError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFaviconFile(null)
                      setFaviconError(null)
                      setFaviconPreview(null)
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              ) : faviconPreview ? (
                <div className="text-center space-y-4">
                  <div className="relative w-full h-20 flex items-center justify-center">
                    <Image
                      src={faviconPreview || "/placeholder.svg"}
                      alt="Favicon Preview"
                      width={40}
                      height={40}
                      className="h-full w-auto object-contain"
                    />
                    <button
                      className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFaviconFile(null)
                        setFaviconPreview(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">SVG file ready to upload</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Upload className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Drag and drop your SVG favicon file here, or click to browse
                  </p>
                  <Button variant="outline" onClick={() => faviconInputRef.current?.click()}>
                    Select SVG File
                  </Button>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept=".svg"
                    className="hidden"
                    onChange={handleFaviconFileChange}
                  />
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended format: SVG. Maximum size: 2MB. The favicon will be used in browser tabs and bookmarks.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaviconModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleFaviconUpload}
              disabled={!faviconFile || !!faviconError || faviconUploading}
              variant="brand"
            >
              {faviconUploading ? (
                <>
                  <span className="mr-2">Uploading...</span>
                  <span className="animate-spin">⟳</span>
                </>
              ) : (
                "Upload Favicon"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Primary Color Modal */}
      <Dialog open={primaryColorModalOpen} onOpenChange={setPrimaryColorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[var(--brand-primary)]">Primary Brand Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="w-full h-24 rounded-md mb-4 flex items-center justify-center"
              style={{
                backgroundColor: tempPrimaryColor,
                transition: "background-color 0.2s ease",
              }}
            >
              <span className="text-white text-xl font-bold">{tempPrimaryColor}</span>
            </div>

            {/* Color picker input */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <Label htmlFor="primary-color-input" className="text-sm font-medium mb-1 block">
                  Hex Color Code
                </Label>
                <div className="flex">
                  <Input
                    id="primary-color-input"
                    type="text"
                    value={primaryInputValue}
                    onChange={handlePrimaryInputChange}
                    className={`w-full ${primaryInputError ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="#RRGGBB"
                  />
                  <input
                    ref={primaryColorPickerRef}
                    type="color"
                    value={tempPrimaryColor}
                    onChange={(e) => handleColorPickerChange(e)}
                    className="ml-2 h-9 w-9 rounded cursor-pointer border"
                    aria-label="Choose color"
                  />
                </div>
                {primaryInputError && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid hex color (e.g., #FF0000)</p>
                )}
              </div>
            </div>

            {/* Preset colors */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preset Colors</Label>
              <div className="grid grid-cols-7 gap-2">
                {PRIMARY_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-full aspect-square rounded-md border transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePrimaryColorChange(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {tempPrimaryColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
              <div className="flex gap-4">
                <div className="flex-1 border rounded-md p-4">
                  <div className="h-8 w-full rounded-md mb-2" style={{ backgroundColor: tempPrimaryColor }}></div>
                  <div className="h-4 w-24 rounded-md" style={{ backgroundColor: `${tempPrimaryColor}40` }}></div>
                </div>
                <div className="flex-1 border rounded-md p-4 flex items-center justify-center">
                  <LogoSvg color={tempPrimaryColor} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPrimaryColorModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePrimaryColorSave}
              disabled={primaryInputError}
              style={{
                backgroundColor: !primaryInputError ? tempPrimaryColor : undefined,
                color: "white",
                transition: "background-color var(--transition-color)",
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Secondary Color Modal */}
      <Dialog open={secondaryColorModalOpen} onOpenChange={setSecondaryColorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[var(--brand-primary)]">Secondary Brand Color</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="w-full h-24 rounded-md mb-4 flex items-center justify-center"
              style={{
                backgroundColor: tempSecondaryColor,
                transition: "background-color 0.2s ease",
              }}
            >
              <span className="text-white text-xl font-bold">{tempSecondaryColor}</span>
            </div>

            {/* Color picker input */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <Label htmlFor="secondary-color-input" className="text-sm font-medium mb-1 block">
                  Hex Color Code
                </Label>
                <div className="flex">
                  <Input
                    id="secondary-color-input"
                    type="text"
                    value={secondaryInputValue}
                    onChange={handleSecondaryInputChange}
                    className={`w-full ${secondaryInputError ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="#RRGGBB"
                  />
                  <input
                    ref={secondaryColorPickerRef}
                    type="color"
                    value={tempSecondaryColor}
                    onChange={(e) => handleColorPickerChange(e, true)}
                    className="ml-2 h-9 w-9 rounded cursor-pointer border"
                    aria-label="Choose color"
                  />
                </div>
                {secondaryInputError && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid hex color (e.g., #FF0000)</p>
                )}
              </div>
            </div>

            {/* Preset colors */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preset Colors</Label>
              <div className="grid grid-cols-7 gap-2">
                {SECONDARY_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-full aspect-square rounded-md border transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 relative"
                    style={{ backgroundColor: color }}
                    onClick={() => handleSecondaryColorChange(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {tempSecondaryColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">Live Preview</Label>
              <div className="flex gap-4">
                <div className="flex-1 border rounded-md p-4">
                  <div className="h-8 w-full rounded-md mb-2" style={{ backgroundColor: tempSecondaryColor }}></div>
                  <div className="h-4 w-24 rounded-md" style={{ backgroundColor: `${tempSecondaryColor}40` }}></div>
                </div>
                <div className="flex-1 border rounded-md p-4 flex items-center justify-center">
                  <div
                    className="h-8 rounded-full px-4 flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: tempSecondaryColor }}
                  >
                    Button Example
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSecondaryColorModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSecondaryColorSave}
              disabled={secondaryInputError}
              style={{
                backgroundColor: !secondaryInputError ? tempSecondaryColor : undefined,
                color: "white",
                transition: "background-color var(--transition-color)",
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{confirmationTitle}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">This change cannot be undone. Are you sure you want to proceed?</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmationAction()
                setConfirmationOpen(false)
              }}
              variant="brand"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModuleLayout>
  )
}
