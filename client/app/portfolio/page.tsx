"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, TrendingDown, Search } from "lucide-react"

const holdings = [
  {
    id: 1,
    symbol: "RELIANCE",
    name: "Reliance Industries",
    quantity: 50,
    avgPrice: 2750,
    currentPrice: 2890,
    sector: "Energy",
  },
  {
    id: 2,
    symbol: "TCS",
    name: "Tata Consultancy Services",
    quantity: 25,
    avgPrice: 3200,
    currentPrice: 3450,
    sector: "Technology",
  },
  {
    id: 3,
    symbol: "INFY",
    name: "Infosys Limited",
    quantity: 100,
    avgPrice: 1450,
    currentPrice: 1520,
    sector: "Technology",
  },
  { id: 4, symbol: "HDFC", name: "HDFC Bank", quantity: 75, avgPrice: 1600, currentPrice: 1680, sector: "Finance" },
  { id: 5, symbol: "ITC", name: "ITC Limited", quantity: 200, avgPrice: 380, currentPrice: 420, sector: "FMCG" },
]

const sectorColors = {
  Technology: "#3b82f6",
  Finance: "#10b981",
  Energy: "#f59e0b",
  FMCG: "#ef4444",
}

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("symbol")
  const [filterSector, setFilterSector] = useState("all")
  const portfolioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-card",
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
      )
    }, portfolioRef)

    return () => ctx.revert()
  }, [])

  const filteredHoldings = holdings
    .filter(
      (holding) =>
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((holding) => filterSector === "all" || holding.sector === filterSector)
    .sort((a, b) => {
      switch (sortBy) {
        case "gainLoss":
          const aGain = (a.currentPrice - a.avgPrice) * a.quantity
          const bGain = (b.currentPrice - b.avgPrice) * b.quantity
          return bGain - aGain
        case "value":
          return b.currentPrice * b.quantity - a.currentPrice * a.quantity
        default:
          return a.symbol.localeCompare(b.symbol)
      }
    })

  const portfolioValue = holdings.reduce((total, holding) => total + holding.currentPrice * holding.quantity, 0)
  const totalInvestment = holdings.reduce((total, holding) => total + holding.avgPrice * holding.quantity, 0)
  const totalGainLoss = portfolioValue - totalInvestment

  const sectorData = Object.entries(
    holdings.reduce(
      (acc, holding) => {
        const value = holding.currentPrice * holding.quantity
        acc[holding.sector] = (acc[holding.sector] || 0) + value
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([sector, value]) => ({
    name: sector,
    value: Math.round((value / portfolioValue) * 100),
    color: sectorColors[sector as keyof typeof sectorColors] || "#6b7280",
  }))

  return (
    <div ref={portfolioRef} className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{portfolioValue.toLocaleString()}</p>
          <p className={`text-sm ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalGainLoss >= 0 ? "+" : ""}₹{totalGainLoss.toLocaleString()}(
            {((totalGainLoss / totalInvestment) * 100).toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="portfolio-card">
          <CardHeader>
            <CardTitle className="text-lg">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="portfolio-card">
          <CardHeader>
            <CardTitle className="text-lg">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{portfolioValue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="portfolio-card">
          <CardHeader>
            <CardTitle className="text-lg">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalGainLoss >= 0 ? "+" : ""}₹{totalGainLoss.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Holdings List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="portfolio-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search holdings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symbol">Symbol</SelectItem>
                    <SelectItem value="gainLoss">Gain/Loss</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Energy">Energy</SelectItem>
                    <SelectItem value="FMCG">FMCG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Holdings */}
          <div className="space-y-4">
            {filteredHoldings.map((holding) => {
              const gainLoss = (holding.currentPrice - holding.avgPrice) * holding.quantity
              const gainLossPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100
              const currentValue = holding.currentPrice * holding.quantity

              return (
                <Card key={holding.id} className="portfolio-card hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{holding.symbol}</h3>
                          <Badge variant="outline">{holding.sector}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{holding.name}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{holding.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg Price</p>
                            <p className="font-medium">₹{holding.avgPrice}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{holding.currentPrice}</p>
                        <p className="text-sm text-muted-foreground mb-2">Value: ₹{currentValue.toLocaleString()}</p>
                        <div className={`flex items-center gap-1 ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {gainLoss >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-medium">
                            {gainLoss >= 0 ? "+" : ""}₹{gainLoss.toFixed(0)} ({gainLossPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="space-y-6">
          <Card className="portfolio-card">
            <CardHeader>
              <CardTitle>Sector Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {sectorData.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                      <span className="text-sm">{sector.name}</span>
                    </div>
                    <span className="text-sm font-medium">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
