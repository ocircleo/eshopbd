import { loginSchema, createAdminSchema, updateAdminSchema } from '../validators/auth.js'
import * as userRepository from '../repositories/userRepository.js'
import { hashPassword, comparePassword } from '../lib/password.js'

export async function login(phone, password) {
  // Validate input
  loginSchema.parse({ phone, password })

  // Find user
  const user = await userRepository.findByPhone(phone)
  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Check password
  const isValid = await comparePassword(password, user.password_hash)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  // Return user without password
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function createAdmin(data, currentUser) {
  // Check if current user is super_admin
  if (currentUser.role !== 'super_admin') {
    throw new Error('Unauthorized: Only super_admin can create admins')
  }

  // Validate input
  createAdminSchema.parse(data)

  // Check if phone already exists
  const existing = await userRepository.findByPhone(data.phone)
  if (existing) {
    throw new Error('Phone number already exists')
  }

  // Hash password
  const password_hash = await hashPassword(data.password)

  // Create user
  const user = await userRepository.create({
    name: data.name,
    phone: data.phone,
    password_hash,
    role: 'admin', // Always create as admin
    email: data.email
  })

  // Return without password
  const { password_hash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function updateAdmin(id, updates, currentUser) {
  // Check if current user is super_admin
  if (currentUser.role !== 'super_admin') {
    throw new Error('Unauthorized: Only super_admin can update admins')
  }

  // Validate updates
  updateAdminSchema.parse({ id, ...updates })

  // Update user
  const user = await userRepository.update(id, updates)
  if (!user) {
    throw new Error('Admin not found')
  }

  return user
}

export async function deleteAdmin(id, currentUser) {
  // Check if current user is super_admin
  if (currentUser.role !== 'super_admin') {
    throw new Error('Unauthorized: Only super_admin can delete admins')
  }

  // Cannot delete self
  if (currentUser.id === id) {
    throw new Error('Cannot delete yourself')
  }

  // Delete user
  const user = await userRepository.deleteUser(id)
  if (!user) {
    throw new Error('Admin not found')
  }

  return user
}

export async function listAdmins(search, limit, offset, currentUser) {
  // Check if current user is super_admin
  if (currentUser.role !== 'super_admin') {
    throw new Error('Unauthorized: Only super_admin can list admins')
  }

  const admins = await userRepository.findAllAdmins({ search, limit, offset })
  const total = await userRepository.countAdmins({ search })

  return { admins, total }
}