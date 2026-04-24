import { NextResponse } from 'next/server'
import { getCategories, createCategory } from '../../../../services/catalogService.js'
import { requireAdmin } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    requireAdmin(request)
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    const user = requireAdmin(request)
    const data = await request.json()
    const category = await createCategory(data, user)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}