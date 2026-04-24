import { NextResponse } from 'next/server'
import { createAdmin, listAdmins } from '../../../../services/authService.js'
import { requireSuperAdmin } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    const user = requireSuperAdmin(request)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await listAdmins(search, limit, offset, user)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    const user = requireSuperAdmin(request)
    const data = await request.json()

    const newAdmin = await createAdmin(data, user)
    return NextResponse.json({ admin: newAdmin }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}