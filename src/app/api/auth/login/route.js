import { NextResponse } from 'next/server'
import { login } from '../../../../services/authService.js'
import { signToken } from '../../../../lib/jwt.js'

export async function POST(request) {
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