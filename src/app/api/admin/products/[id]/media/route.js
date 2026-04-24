import { NextResponse } from 'next/server'
import { uploadMedia, getProductMedia } from '../../../../../../services/catalogService.js'
import { requireAdmin } from '../../../../../../lib/auth.js'

export async function GET(request, { params }) {
  try {
    requireAdmin(request)
    const product_id = parseInt(params.id)
    const media = await getProductMedia(product_id)
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request, { params }) {
  try {
    requireAdmin(request)
    const product_id = parseInt(params.id)
    const formData = await request.formData()
    const file = formData.get('file')
    const type = formData.get('type')

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type required' }, { status: 400 })
    }

    if (!['image', 'video'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const media = await uploadMedia(product_id, type, file)
    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}