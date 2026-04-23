import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required')
})

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be positive'),
  category_id: z.number().int().positive('Category ID is required'),
  short_description: z.string().optional(),
  details: z.record(z.any()).optional()
})

export const updateProductSchema = productSchema.partial().extend({
  id: z.number().int().positive()
})

export const mediaUploadSchema = z.object({
  product_id: z.number().int().positive(),
  type: z.enum(['image', 'video']),
  file: z.any() // Will validate in service
})