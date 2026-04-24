'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const statusSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  orderId: z.string().min(1, 'Order ID is required')
})

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800'
}

export default function OrderStatusPage() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      phone: searchParams.get('phone') || '',
      orderId: searchParams.get('orderId') || ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/status?phone=${encodeURIComponent(data.phone)}&orderId=${data.orderId}`)
      if (res.ok) {
        const orderData = await res.json()
        setOrder(orderData)
      } else if (res.status === 404) {
        setError('Order not found. Please check your phone number and order ID.')
      } else {
        setError('Failed to fetch order status.')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('An error occurred. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground">Check Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="orderId">Order ID</Label>
                  <Input id="orderId" {...register('orderId')} />
                  {errors.orderId && <p className="text-red-500 text-sm">{errors.orderId.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                  {loading ? 'Checking...' : 'Check Status'}
                </Button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive text-destructive rounded">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {order && (
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Order ID</Label>
                    <p className="text-lg font-semibold">#{order.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p>{order.name}</p>
                  <p>{order.phone}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p>{order.address}</p>
                </div>

                {order.note && (
                  <div>
                    <Label className="text-sm font-medium">Note</Label>
                    <p>{order.note}</p>
                  </div>
                )}

                {order.tracking_text && (
                  <div>
                    <Label className="text-sm font-medium">Tracking</Label>
                    <p>{order.tracking_text}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Items</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product?.title || 'Unknown'}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price_at_purchase}</TableCell>
                          <TableCell>${(item.quantity * item.price_at_purchase).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="text-right font-semibold mt-2">
                    Total: ${order.items.reduce((sum, item) => sum + item.quantity * item.price_at_purchase, 0).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
  

    </div>
  )
}