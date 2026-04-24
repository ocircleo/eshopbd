import { NextResponse } from 'next/server'
import { updateCategory, deleteCategory } from '../../../../../services/catalogService.js'
import { requireAdmin } from '../../../../../lib/auth.js'

export async function PUT(request, { params }) {
  try {
    requireAdmin(request)
    const id = parseInt(params.id)
    const data = await request.json()
    const category = await updateCategory(id, data)
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    requireAdmin(request)
    const id = parseInt(params.id)
    const category = await deleteCategory(id)
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}