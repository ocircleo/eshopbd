import { NextResponse } from 'next/server'
import { updateAdmin, deleteAdmin } from '../../../../../services/authService.js'
import { requireSuperAdmin } from '../../../../../lib/auth.js'

export async function PUT(request, { params }) {
  try {
    const user = requireSuperAdmin(request)
    const id = parseInt(params.id)
    const updates = await request.json()

    const updatedAdmin = await updateAdmin(id, updates, user)
    return NextResponse.json({ admin: updatedAdmin })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = requireSuperAdmin(request)
    const id = parseInt(params.id)

    const deletedAdmin = await deleteAdmin(id, user)
    return NextResponse.json({ admin: deletedAdmin })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}