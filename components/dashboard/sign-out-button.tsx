"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signOut } from "@/lib/actions/auth"

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      setIsSigningOut(false)
    }
  }

  return (
    <form action={handleSignOut}>
      <Button variant="outline" type="submit" disabled={isSigningOut}>
        {isSigningOut ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing out...
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    </form>
  )
}
