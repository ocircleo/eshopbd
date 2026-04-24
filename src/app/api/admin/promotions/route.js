import { NextResponse } from 'next/server'
import { getPromotions, createPromotion } from '../../../../services/promotionService.js'
import { requireAdmin } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    requireAdmin(request)
    const promotions = await getPromotions()
    return NextResponse.json(promotions)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    requireAdmin(request)
    const data = await request.json()
    const promotion = await createPromotion(data)
    return NextResponse.json(promotion, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}