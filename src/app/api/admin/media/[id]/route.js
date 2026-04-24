import { NextResponse } from 'next/server'
import { deleteMedia } from '../../../../../services/catalogService.js'
import { requireAdmin } from '../../../../../lib/auth.js'

export async function DELETE(request, { params }) {
  try {
    requireAdmin(request)
    const id = parseInt(params.id)
    const media = await deleteMedia(id)
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}