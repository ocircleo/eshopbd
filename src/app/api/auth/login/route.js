import { NextResponse } from 'next/server'
import { login } from '../../../../services/authService.js'
import { signToken } from '../../../../lib/jwt.js'
import { rateLimit } from '../../../../lib/rateLimit.js'

export async function POST(request) {
  // Rate limit login attempts: 5 per 15 minutes per IP
  const rateLimitResponse = rateLimit(5, 15 * 60 * 1000)(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { phone, password } = await request.json()

    const user = await login(phone, password)

    const token = signToken({ id: user.id, role: user.role })

    const response = NextResponse.json({ user })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 // 12 hours
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}