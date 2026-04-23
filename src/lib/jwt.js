import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}