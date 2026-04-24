import { NextResponse } from 'next/server'
import { uploadBanner } from '../../../../../services/promotionService.js'
import { requireAdmin } from '../../../../../lib/auth.js'

export async function POST(request) {
  try {
    requireAdmin(request)
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 })
    }

    const url = await uploadBanner(file)
    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}