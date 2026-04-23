import { NextRequest, NextResponse } from 'next/server'
import { updateProduct, deleteProduct } from '../../../../../services/catalogService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function PUT(request, { params }) {
  try {
    getUser(request)
    const id = parseInt(params.id)
    const data = await request.json()
    const product = await updateProduct(id, data)
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    getUser(request)
    const id = parseInt(params.id)
    const product = await deleteProduct(id)
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}