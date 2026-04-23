import { NextRequest, NextResponse } from 'next/server'
import { uploadBanner } from '../../../../../services/promotionService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function POST(request) {
  try {
    getUser(request)
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