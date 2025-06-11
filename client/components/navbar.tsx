"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/journal", label: "Journal" },
  { href: "/orders", label: "Orders" },
  { href: "/auth/test", label: "Auth Test" }, // Add this line for testing
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Invest</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/auth/angel-one`,
                  "_self"
                )
              }
            >
              Login with Angel One
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              {isAuthenticated ? (
                <Button variant="outline" className="w-full" onClick={logout}>
                  Logout
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/auth/angel-one`,
                      "_self"
                    )
                  }
                >
                  Login with Angel One
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
