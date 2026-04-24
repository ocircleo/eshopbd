import { NextResponse } from 'next/server'
import { listOrders } from '../../../../services/orderService.js'
import { requireAdmin } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    const user = requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const phone = searchParams.get('phone')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await listOrders({ status, phone, limit, offset }, user)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}