import { NextRequest, NextResponse } from 'next/server'
import { updatePromotion, deletePromotion } from '../../../../../services/promotionService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function PUT(request, { params }) {
  try {
    getUser(request)
    const id = parseInt(params.id)
    const data = await request.json()
    const promotion = await updatePromotion(id, data)
    return NextResponse.json(promotion)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    getUser(request)
    const id = parseInt(params.id)
    const promotion = await deletePromotion(id)
    return NextResponse.json(promotion)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}