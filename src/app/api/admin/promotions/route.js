import { NextRequest, NextResponse } from 'next/server'
import { getPromotions, createPromotion } from '../../../../services/promotionService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function GET(request) {
  try {
    getUser(request)
    const promotions = await getPromotions()
    return NextResponse.json(promotions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    getUser(request)
    const data = await request.json()
    const promotion = await createPromotion(data)
    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}