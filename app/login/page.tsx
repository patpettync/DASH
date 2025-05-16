import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { UserAuthForm } from "@/components/blocks/user-auth-form"
import { Logo } from "@/components/ui-core/logo"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/abstract-gradient.png"
          width={1200}
          height={668}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/placeholder.svg?key=mye63"
          width={1200}
          height={668}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo variant="light" size="md" />
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
              <p className="text-sm text-muted-foreground">Enter your email below to sign in to your account</p>
            </div>
            <UserAuthForm />
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">If sign-in buttons don't work:</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">Go to Dashboard Directly</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
