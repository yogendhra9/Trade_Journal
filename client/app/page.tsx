"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, BookOpen, BarChart3 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

gsap.registerPlugin(ScrollTrigger)

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const tickerRef = useRef<HTMLDivElement>(null)

  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(".hero-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })

      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
      )

      gsap.fromTo(
        ".hero-buttons",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
      )

      // Floating AI thoughts
      gsap.to(".ai-thought", {
        y: -10,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      })

      // Feature cards animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          },
        },
      )

      // Background glow animation
      gsap.to(".glow-bg", {
        scale: 1.1,
        opacity: 0.8,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const stockData = [
    "RELIANCE ₹2,890 ↗️ +2.5%",
    "TCS ₹3,450 ↗️ +1.8%",
    "INFY ₹1,520 ↘️ -0.5%",
    "HDFC ₹1,680 ↗️ +3.2%",
    "ITC ₹420 ↗️ +1.2%",
    "WIPRO ₹385 ↘️ -1.1%",
  ]

  return (
    <div ref={heroRef} className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow-bg absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="glow-bg absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Ticker Tape */}
        <div className="absolute top-20 w-full overflow-hidden bg-black/5 dark:bg-white/5 py-2">
          <div ref={tickerRef} className="ticker-tape whitespace-nowrap text-sm font-medium">
            {stockData.join(" • ")} • {stockData.join(" • ")}
          </div>
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 glow-text bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invest Smart with AI
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Let AI analyze, decide, execute, and journal your trades.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <>
                <Button size="lg" className="text-lg px-8 py-6" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => router.push("/portfolio")}
                >
                  View Portfolio
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={() =>
                    window.open("https://smartapi.angelbroking.com/publisher-login?api_key=YOUR_API_KEY", "_self")
                  }
                >
                  Connect Broker (Angel One)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6"
                  onClick={() => router.push("/dashboard")}
                >
                  🎯 Try Demo
                </Button>
              </>
            )}
          </div>

          {/* Floating AI Thoughts */}
          <div className="relative">
            <div className="ai-thought absolute -top-20 left-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-sm">Analyzing ITC... 📊</p>
            </div>
            <div className="ai-thought absolute -top-32 right-1/3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-sm">Momentum strong 📈</p>
            </div>
            <div className="ai-thought absolute -top-16 right-1/4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <p className="text-sm">Sold Reliance @ ₹2890 ✅</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="feature-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Auto Journal</h3>
                <p className="text-muted-foreground">Every trade logged with AI-generated reasoning.</p>
              </CardContent>
            </Card>

            <Card className="feature-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-2">Trade via AI</h3>
                <p className="text-muted-foreground">Talk to AI like 'Buy best stocks under ₹100' — it decides</p>
              </CardContent>
            </Card>

            <Card className="feature-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
                <p className="text-muted-foreground">Real-time portfolio insights and performance tracking</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
