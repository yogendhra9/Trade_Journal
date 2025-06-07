"use client"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Edit3, Save, TrendingUp, TrendingDown, Brain } from "lucide-react"

interface JournalEntry {
  id: string
  date: string
  stock: string
  action: "BUY" | "SELL"
  quantity: number
  price: number
  pnl: number
  aiReasoning: string
  userNotes: string
  mood: string
  confidence: number
}

const journalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    stock: "RELIANCE",
    action: "BUY",
    quantity: 50,
    price: 2750,
    pnl: 7000,
    aiReasoning:
      "Strong quarterly results expected. Oil prices trending upward. Technical indicators show bullish momentum.",
    userNotes: "Bought on dip after earnings announcement. Good entry point.",
    mood: "😊",
    confidence: 85,
  },
  {
    id: "2",
    date: "2024-01-14",
    stock: "TCS",
    action: "SELL",
    quantity: 25,
    price: 3450,
    pnl: -800,
    aiReasoning:
      "IT sector showing weakness. Dollar strengthening may impact margins. Booking profits at resistance level.",
    userNotes: "Sold too early, but profit is profit. Market was uncertain.",
    mood: "😐",
    confidence: 70,
  },
  {
    id: "3",
    date: "2024-01-13",
    stock: "INFY",
    action: "BUY",
    quantity: 100,
    price: 1520,
    pnl: 1200,
    aiReasoning: "Strong client additions in Q3. Digital transformation deals increasing. Valuation attractive.",
    userNotes: "Great fundamentals. Long-term hold candidate.",
    mood: "😄",
    confidence: 90,
  },
]

const moodOptions = [
  { value: "😄", label: "Very Confident" },
  { value: "😊", label: "Confident" },
  { value: "😐", label: "Neutral" },
  { value: "😟", label: "Uncertain" },
  { value: "😰", label: "Worried" },
]

export default function Journal() {
  const [entries, setEntries] = useState(journalEntries)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState("")
  const [editMood, setEditMood] = useState("")
  const journalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".journal-entry",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
      )
    }, journalRef)

    return () => ctx.revert()
  }, [])

  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry.id)
    setEditNotes(entry.userNotes)
    setEditMood(entry.mood)
  }

  const handleSave = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, userNotes: editNotes, mood: editMood } : entry)),
    )
    setEditingId(null)
  }

  const totalPnL = entries.reduce((sum, entry) => sum + entry.pnl, 0)
  const winRate = (entries.filter((entry) => entry.pnl > 0).length / entries.length) * 100

  return (
    <div ref={journalRef} className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Journal</h1>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{entries.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{winRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Avg Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(entries.reduce((sum, entry) => sum + entry.confidence, 0) / entries.length).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Journal Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Trade History</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>

          <div className="space-y-8">
            {entries.map((entry, index) => (
              <div key={entry.id} className="journal-entry relative flex gap-6">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 w-4 h-4 rounded-full border-2 bg-background ${
                    entry.pnl >= 0 ? "border-green-500" : "border-red-500"
                  }`}
                ></div>

                {/* Entry card */}
                <Card className="flex-1 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant={entry.action === "BUY" ? "default" : "secondary"}>{entry.action}</Badge>
                        <h3 className="font-semibold text-lg">{entry.stock}</h3>
                        <span className="text-sm text-muted-foreground">
                          {entry.quantity} shares @ ₹{entry.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center gap-1 ${entry.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {entry.pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-medium">
                            {entry.pnl >= 0 ? "+" : ""}₹{entry.pnl}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* AI Reasoning */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-600">AI Analysis</span>
                        <Badge variant="outline" className="text-xs">
                          {entry.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm">{entry.aiReasoning}</p>
                    </div>

                    {/* User Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Your Notes</span>
                        {editingId !== entry.id && (
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(entry)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {editingId === entry.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add your thoughts about this trade..."
                            className="min-h-20"
                          />
                          <div className="flex items-center gap-3">
                            <Select value={editMood} onValueChange={setEditMood}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select mood" />
                              </SelectTrigger>
                              <SelectContent>
                                {moodOptions.map((mood) => (
                                  <SelectItem key={mood.value} value={mood.value}>
                                    {mood.value} {mood.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={() => handleSave(entry.id)} size="sm">
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{entry.mood}</span>
                            <span className="text-sm text-muted-foreground">
                              {moodOptions.find((m) => m.value === entry.mood)?.label}
                            </span>
                          </div>
                          <p className="text-sm">{entry.userNotes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
