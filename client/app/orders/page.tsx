"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, CheckCircle, Clock, X } from "lucide-react"

interface Order {
  id: string
  stock: string
  action: "BUY" | "SELL"
  quantity: number
  price: number
  orderType: "MARKET" | "LIMIT" | "STOP_LOSS"
  status: "PENDING" | "EXECUTED" | "CANCELLED"
  timestamp: string
}

const recentOrders: Order[] = [
  {
    id: "1",
    stock: "RELIANCE",
    action: "BUY",
    quantity: 50,
    price: 2890,
    orderType: "LIMIT",
    status: "EXECUTED",
    timestamp: "2024-01-15 10:30:45",
  },
  {
    id: "2",
    stock: "TCS",
    action: "SELL",
    quantity: 25,
    price: 3450,
    orderType: "MARKET",
    status: "EXECUTED",
    timestamp: "2024-01-15 09:15:22",
  },
  {
    id: "3",
    stock: "INFY",
    action: "BUY",
    quantity: 100,
    price: 1500,
    orderType: "LIMIT",
    status: "PENDING",
    timestamp: "2024-01-15 11:45:10",
  },
  {
    id: "4",
    stock: "HDFC",
    action: "BUY",
    quantity: 75,
    price: 1650,
    orderType: "STOP_LOSS",
    status: "CANCELLED",
    timestamp: "2024-01-14 16:20:33",
  },
]

const stockOptions = ["RELIANCE", "TCS", "INFY", "HDFC", "ITC", "WIPRO", "HCLTECH", "TECHM", "LT", "MARUTI"]

export default function Orders() {
  const [orders, setOrders] = useState(recentOrders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    stock: "",
    action: "BUY",
    quantity: "",
    price: "",
    orderType: "MARKET",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const ordersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".order-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        },
      )
    }, ordersRef)

    return () => ctx.revert()
  }, [orders])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newOrder: Order = {
      id: Date.now().toString(),
      stock: formData.stock,
      action: formData.action as "BUY" | "SELL",
      quantity: Number.parseInt(formData.quantity),
      price: Number.parseFloat(formData.price),
      orderType: formData.orderType as "MARKET" | "LIMIT" | "STOP_LOSS",
      status: "PENDING",
      timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    }

    setOrders((prev) => [newOrder, ...prev])
    setShowConfirmation(true)

    // Reset form
    setFormData({
      stock: "",
      action: "BUY",
      quantity: "",
      price: "",
      orderType: "MARKET",
    })

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false)
      setIsDialogOpen(false)
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "EXECUTED":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "CANCELLED":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EXECUTED":
        return "text-green-600"
      case "PENDING":
        return "text-yellow-600"
      case "CANCELLED":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div ref={ordersRef} className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Place Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Place New Order</DialogTitle>
            </DialogHeader>

            {showConfirmation ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Order Placed Successfully!</h3>
                <p className="text-muted-foreground">
                  Your {formData.action} order for {formData.stock} has been submitted.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Select
                    value={formData.stock}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, stock: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stock" />
                    </SelectTrigger>
                    <SelectContent>
                      {stockOptions.map((stock) => (
                        <SelectItem key={stock} value={stock}>
                          {stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <Select
                      value={formData.action}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, action: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUY">BUY</SelectItem>
                        <SelectItem value="SELL">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, orderType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">Market</SelectItem>
                      <SelectItem value="LIMIT">Limit</SelectItem>
                      <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.orderType !== "MARKET" && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      required={formData.orderType !== "MARKET"}
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!formData.stock || !formData.quantity}>
                  Place Order
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Order Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="order-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card className="order-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Executed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((order) => order.status === "EXECUTED").length}
            </p>
          </CardContent>
        </Card>

        <Card className="order-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter((order) => order.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>

        <Card className="order-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {orders.filter((order) => order.status === "CANCELLED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="order-card">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge variant={order.action === "BUY" ? "default" : "secondary"}>{order.action}</Badge>
                  </div>
                  <div>
                    <p className="font-medium">{order.stock}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.quantity} shares • {order.orderType}
                      {order.orderType !== "MARKET" && ` @ ₹${order.price}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
