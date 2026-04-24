import { NextResponse } from 'next/server'
import { requireAdmin, requireSuperAdmin } from './src/lib/auth.js'

export function middleware(request) {
  const pathname = request.nextUrl.pathname
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const isAdminApiPath = pathname === '/api/admin' || pathname.startsWith('/api/admin/')

  if (isAdminPath || isAdminApiPath) {
    if (pathname === '/admin/login') return NextResponse.next()

    try {
      if (pathname === '/admin/admins' || pathname.startsWith('/admin/admins/')) {
        requireSuperAdmin(request)
      } else {
        requireAdmin(request)
      }

      return NextResponse.next()
    } catch (error) {
      if (isAdminApiPath) {
        const status = error.message === 'Forbidden' ? 403 : 401
        const message = status === 403 ? 'Forbidden' : 'Unauthorized'
        return NextResponse.json({ error: message }, { status })
      }

      if (error.message === 'Forbidden') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }

      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin', '/api/admin/:path*', '/admin', '/admin/:path*']
}