import { NextResponse } from 'next/server'
import { getProducts, createProduct } from '../../../../services/catalogService.js'
import { requireAdmin } from '../../../../lib/auth.js'

export async function GET(request) {
  try {
    requireAdmin(request)
    const { searchParams } = new URL(request.url)
    const category_id = searchParams.get('category_id') ? parseInt(searchParams.get('category_id')) : undefined
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await getProducts({ category_id, limit, offset })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    const user = requireAdmin(request)
    const data = await request.json()
    const product = await createProduct(data, user)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}