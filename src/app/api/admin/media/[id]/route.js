import { NextRequest, NextResponse } from 'next/server'
import { deleteMedia } from '../../../../../services/catalogService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function DELETE(request, { params }) {
  try {
    getUser(request)
    const id = parseInt(params.id)
    const media = await deleteMedia(id)
    return NextResponse.json(media)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}