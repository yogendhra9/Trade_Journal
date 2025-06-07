"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing authentication...")

  // useEffect(() => {
  //   const handleAuth = async () => {
  //     try {
  //       // Get auth_token from URL query parameters
  //       const authToken = searchParams.get("auth_token")
  //       const requestToken = searchParams.get("request_token")
  //       const status = searchParams.get("status")

  //       console.log("Auth callback params:", { authToken, requestToken, status })

  //       if (!authToken && !requestToken) {
  //         throw new Error("No authentication token found in URL")
  //       }

  //       // Save the token to localStorage
  //       const tokenToSave = authToken || requestToken
  //       if (tokenToSave) {
  //         localStorage.setItem("angelOneToken", tokenToSave)
  //         console.log("Angel One token saved:", tokenToSave)
  //       }

  //       // Check if authentication was successful
  //       if (status === "success" || authToken || requestToken) {
  //         setStatus("success")
  //         setMessage("Successfully authenticated with Angel One!")

  //         // Redirect to dashboard after 2 seconds
  //         setTimeout(() => {
  //           router.push("/dashboard")
  //         }, 2000)
  //       } else {
  //         throw new Error("Authentication failed")
  //       }
  //     } catch (error) {
  //       console.error("Auth callback error:", error)
  //       setStatus("error")
  //       setMessage("Authentication failed. Please try again.")

  //       // Redirect to home page after 3 seconds on error
  //       setTimeout(() => {
  //         router.push("/")
  //       }, 3000)
  //     }
  //   }

  //   handleAuth()
  // }, [searchParams, router])
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const requestToken = searchParams.get("request_token")
        const status = searchParams.get("status")
  
        console.log("Auth callback params:", { requestToken, status })
  
        if (!requestToken) {
          throw new Error("No request token found in URL")
        }
  
        // 🔁 Call your backend to verify and get auth_token
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ request_token: requestToken }),
        })
  
        const data = await response.json()
  
        if (!response.ok || !data.auth_token) {
          throw new Error("Failed to exchange token")
        }
  
        // ✅ Save the auth_token to localStorage
        localStorage.setItem("angelOneToken", data.auth_token)
        console.log("Angel One auth_token saved:", data.auth_token)
  
        setStatus("success")
        setMessage("Successfully authenticated with Angel One!")
  
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")
        setMessage("Authentication failed. Please try again.")
  
        // Redirect to home page after error
        setTimeout(() => {
          router.push("/")
        }, 3000)
      }
    }
  
    handleAuth()
  }, [searchParams, router])
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />}
            {status === "error" && (
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold mb-4">
            {status === "loading" && "Logging you in with Angel One..."}
            {status === "success" && "Authentication Successful!"}
            {status === "error" && "Authentication Failed"}
          </h1>

          <p className="text-muted-foreground mb-6">{message}</p>

          {status === "success" && (
            <div className="space-y-2">
              <p className="text-sm text-green-600">Redirecting to dashboard...</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-2000 ease-out"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">Redirecting to home page...</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-3000 ease-out"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-4">Loading...</h1>
              <p className="text-muted-foreground">Please wait while we process your request.</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
