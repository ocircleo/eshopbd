import { verifyToken } from './jwt.js'

export function getUserFromRequest(request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    throw new Error('Unauthorized')
  }

  const user = verifyToken(token)

  if (!user || !user.role) {
    throw new Error('Unauthorized')
  }

  return user
}

export function requireAdmin(request) {
  const user = getUserFromRequest(request)
  if (!['admin', 'super_admin'].includes(user.role)) {
    throw new Error('Unauthorized')
  }
  return user
}

export function requireSuperAdmin(request) {
  const user = getUserFromRequest(request)
  if (user.role !== 'super_admin') {
    throw new Error('Forbidden')
  }
  return user
}
