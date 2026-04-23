import { z } from 'zod'

export const promotionSchema = z.object({
  image_url: z.string().url('Invalid image URL'),
  redirect_url: z.string().url('Invalid redirect URL'),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional()
})

export const updatePromotionSchema = promotionSchema.partial().extend({
  id: z.number().int().positive()
})