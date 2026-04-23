import { NextRequest, NextResponse } from 'next/server'
import { updateOrder } from '../../../../../services/orderService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function PUT(request, { params }) {
  try {
    const user = getUser(request)
    const id = parseInt(params.id)
    const data = await request.json()
    const order = await updateOrder(id, data, user)
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}