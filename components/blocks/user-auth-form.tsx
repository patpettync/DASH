"use client"

import type * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    // PLACEHOLDER: Add real authentication logic here
    // This would typically include:
    // 1. API call to authentication endpoint
    // 2. Token storage in cookies/localStorage
    // 3. User data fetching
    // 4. Error handling for invalid credentials

    // Temporary simulation of successful login with delay
    setTimeout(() => {
      console.log("Login attempted with:", values)
      setIsLoading(false)
      // Redirect to dashboard after successful login
      router.push("/dashboard")
    }, 1000)
  }

  const handleO365Login = () => {
    setIsLoading(true)
    // PLACEHOLDER: Add real O365 SSO authentication logic here

    // Temporary simulation of successful SSO login with delay
    setTimeout(() => {
      console.log("O365 SSO login attempted")
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button variant="link" className="px-0 font-normal h-auto" size="sm" asChild>
                    <a href="/forgot-password">Forgot password?</a>
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="brand" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleO365Login}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 23 23"
          fill="none"
          stroke="currentColor"
          strokeWidth="0"
          className="mr-2 h-4 w-4 dark:grayscale"
        >
          <path d="M11.5 1L1 5.5V18L11.5 22.5L22 18V5.5L11.5 1Z" fill="#F25022" className="dark:fill-[#737373]" />
          <path d="M11.5 1L1 5.5V18L11.5 22.5V1Z" fill="#7FBA00" className="dark:fill-[#a3a3a3]" />
          <path d="M22 5.5L11.5 1V22.5L22 18V5.5Z" fill="#00A4EF" className="dark:fill-[#666666]" />
          <path d="M11.5 1L22 5.5L11.5 10L1 5.5L11.5 1Z" fill="#FFB900" className="dark:fill-[#8c8c8c]" />
        </svg>
        Sign in with Office 365
      </Button>
    </div>
  )
}
