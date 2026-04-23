import { NextResponse } from 'next/server'
import { getPromotions } from '../../../services/promotionService.js'

export async function GET() {
  try {
    const promotions = await getPromotions()
    // Filter active
    const active = promotions.filter(p => p.is_active)
    return NextResponse.json(active)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}