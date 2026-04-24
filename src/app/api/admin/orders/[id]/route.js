import { NextResponse } from 'next/server'
import { updateOrder } from '../../../../../services/orderService.js'
import { requireAdmin } from '../../../../../lib/auth.js'

export async function PUT(request, { params }) {
  try {
    const user = requireAdmin(request)
    const id = parseInt(params.id)
    const data = await request.json()
    const order = await updateOrder(id, data, user)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}