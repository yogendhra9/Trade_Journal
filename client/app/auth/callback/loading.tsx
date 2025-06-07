import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Processing Authentication...</h1>
          <p className="text-muted-foreground">Please wait while we verify your credentials.</p>
        </CardContent>
      </Card>
    </div>
  )
}
