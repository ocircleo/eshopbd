import { NextResponse } from 'next/server'
import { verifyToken } from './src/lib/jwt.js'

export function middleware(request) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()

    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      verifyToken(token)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*']
}