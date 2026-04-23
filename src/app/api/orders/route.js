import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getOrder } from '../../../services/orderService.js'

export async function POST(request) {
  try {
    const data = await request.json()
    const order = await createOrder(data)
    return NextResponse.json({ order_id: order.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function GET(request) {
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