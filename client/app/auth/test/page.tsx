"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AuthTest() {
  const router = useRouter()

  const testCallback = () => {
    // Simulate a callback with test parameters
    router.push("/auth/callback?auth_token=test_token_123&status=success")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Auth Route Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">This page confirms that the auth routes are working properly.</p>

          <div className="space-y-2">
            <Button onClick={testCallback} className="w-full">
              Test Auth Callback
            </Button>

            <Button variant="outline" onClick={() => router.push("/auth/callback")} className="w-full">
              Visit Callback Page Directly
            </Button>

            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Current URL: {typeof window !== "undefined" ? window.location.href : "Loading..."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
