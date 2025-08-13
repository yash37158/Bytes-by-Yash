"use client"

import { useState } from "react"
import { signUp } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage("")

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setMessage(result.error)
      } else {
        setMessage("Account created successfully! Please check your email to verify your account.")
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            className="mt-1"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-1" placeholder="admin@yourblog.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1"
            placeholder="Enter your password"
          />
        </div>
      </div>

      {message && (
        <div
          className={`text-sm ${message.includes("error") || message.includes("Error") ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating Account..." : "Create Admin Account"}
      </Button>

      <div className="text-center">
        <Link href="/auth/login" className="text-sm text-blue-600 hover:text-blue-500">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  )
}
