import { NextResponse } from 'next/server'
import { verifyToken } from './src/lib/jwt.js'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const user = verifyToken(token)
      const response = NextResponse.next()
      response.headers.set('x-user', JSON.stringify(user))
      return response
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/admin/:path*'
}