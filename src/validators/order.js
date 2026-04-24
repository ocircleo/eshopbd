import { z } from 'zod'

export const createOrderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  note: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1, 'At least one item required')
})

export const getOrderSchema = z.object({
  phone: z.string().min(1),
  order_id: z.string().uuid()
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'canceled', 'rejected']),
  tracking_text: z.string().optional()
})