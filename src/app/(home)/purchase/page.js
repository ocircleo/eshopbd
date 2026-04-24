'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import useInternalFetcher from '@/utls/fetcher/useInternalFetcher'

const orderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  note: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).min(1, 'At least one item is required')
})

export default function PurchasePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const { data: productsData } = useInternalFetcher('/api/products')
  const products = productsData?.products || []

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items: [{ product_id: searchParams.get('product') || '', quantity: 1 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        const order = await res.json()
        router.push(`/order-status?phone=${encodeURIComponent(data.phone)}&orderId=${order.id}`)
      } else {
        alert('Failed to create order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Error creating order')
    }
    setSubmitting(false)
  }

  const addItem = () => {
    append({ product_id: '', quantity: 1 })
  }

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Place Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>

              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea id="address" {...register('address')} />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>

              <div>
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea id="note" {...register('note')} />
              </div>

              <div>
                <Label>Items</Label>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select
                          value={watch(`items.${index}.product_id`)}
                          onValueChange={(value) => setValue(`items.${index}.product_id`, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {(products || []).map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.title} - ${product.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.items?.[index]?.product_id && (
                          <p className="text-red-500 text-sm">{errors.items[index].product_id.message}</p>
                        )}
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="1"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          placeholder="Qty"
                        />
                        {errors.items?.[index]?.quantity && (
                          <p className="text-red-500 text-sm">{errors.items[index].quantity.message}</p>
                        )}
                      </div>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="border-border hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addItem} className="border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Item
                  </Button>
                </div>
                {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                {submitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

    </div>
  )
}