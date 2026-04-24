import { z } from 'zod'

export const loginSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(1, 'Password is required')
})

export const adminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'super_admin'], 'Invalid role')
})

export const createAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email().optional()
})

export const updateAdminSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional()
})