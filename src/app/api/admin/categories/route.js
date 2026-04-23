import { NextRequest, NextResponse } from 'next/server'
import { getCategories, createCategory } from '../../../../services/catalogService.js'

function getUser(request) {
  const userHeader = request.headers.get('x-user')
  if (!userHeader) throw new Error('No user')
  return JSON.parse(userHeader)
}

export async function GET(request) {
  try {
    getUser(request) // Check auth
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function POST(request) {
  try {
    getUser(request)
    const data = await request.json()
    const category = await createCategory(data)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}