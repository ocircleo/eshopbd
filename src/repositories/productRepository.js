import pool from '../db/pool.js'

export async function findAllProducts({ category_id, limit = 10, offset = 0 }) {
  let query = 'SELECT * FROM products'
  const params = []
  let paramIndex = 1

  if (category_id) {
    query += ` WHERE category_id = $${paramIndex++}`
    params.push(category_id)
  }

  query += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  const result = await pool.query(query, params)
  return result.rows
}

export async function countProducts({ category_id }) {
  let query = 'SELECT COUNT(*) FROM products'
  const params = []

  if (category_id) {
    query += ' WHERE category_id = $1'
    params.push(category_id)
  }

  const result = await pool.query(query, params)
  return parseInt(result.rows[0].count)
}

export async function findProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createProduct({ title, price, category_id, short_description, details }) {
  const result = await pool.query(
    'INSERT INTO products (title, price, category_id, short_description, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, price, category_id, short_description, details]
  )
  return result.rows[0]
}

export async function updateProduct(id, updates) {
  const fields = []
  const values = []
  let paramIndex = 1

  if (updates.title !== undefined) {
    fields.push(`title = $${paramIndex++}`)
    values.push(updates.title)
  }
  if (updates.price !== undefined) {
    fields.push(`price = $${paramIndex++}`)
    values.push(updates.price)
  }
  if (updates.category_id !== undefined) {
    fields.push(`category_id = $${paramIndex++}`)
    values.push(updates.category_id)
  }
  if (updates.short_description !== undefined) {
    fields.push(`short_description = $${paramIndex++}`)
    values.push(updates.short_description)
  }
  if (updates.details !== undefined) {
    fields.push(`details = $${paramIndex++}`)
    values.push(updates.details)
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`
  const result = await pool.query(query, values)
  return result.rows[0] || null
}

export async function deleteProduct(id) {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}