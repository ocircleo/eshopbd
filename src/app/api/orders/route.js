import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrder } from '../../../services/orderService.js'
import { rateLimit } from '../../../lib/rateLimit.js'

export async function POST(request) {
  // Rate limit order creation: 5 orders per hour per IP
  const rateLimitResponse = rateLimit(5, 60 * 60 * 1000)(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const data = await request.json()
    const order = await createOrder(data)
    return NextResponse.json({ order_id: order.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function GET(request) {
  // Rate limit order status checks: 20 per hour per IP
  const rateLimitResponse = rateLimit(20, 60 * 60 * 1000)(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    const order_id = searchParams.get('order_id')

    if (!phone || !order_id) {
      return NextResponse.json({ error: 'Phone and order_id required' }, { status: 400 })
    }

    const order = await getOrder(phone, order_id)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}