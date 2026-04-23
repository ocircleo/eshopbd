import pool from '../db/pool.js'

export async function findAll() {
  const result = await pool.query('SELECT * FROM promotions ORDER BY sort_order, id')
  return result.rows
}

export async function findById(id) {
  const result = await pool.query('SELECT * FROM promotions WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function create({ image_url, redirect_url, sort_order = 0, is_active = true }) {
  const result = await pool.query(
    'INSERT INTO promotions (image_url, redirect_url, sort_order, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
    [image_url, redirect_url, sort_order, is_active]
  )
  return result.rows[0]
}

export async function update(id, updates) {
  const fields = []
  const values = []
  let paramIndex = 1

  if (updates.image_url !== undefined) {
    fields.push(`image_url = $${paramIndex++}`)
    values.push(updates.image_url)
  }
  if (updates.redirect_url !== undefined) {
    fields.push(`redirect_url = $${paramIndex++}`)
    values.push(updates.redirect_url)
  }
  if (updates.sort_order !== undefined) {
    fields.push(`sort_order = $${paramIndex++}`)
    values.push(updates.sort_order)
  }
  if (updates.is_active !== undefined) {
    fields.push(`is_active = $${paramIndex++}`)
    values.push(updates.is_active)
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE promotions SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`
  const result = await pool.query(query, values)
  return result.rows[0] || null
}

export async function deletePromotion(id) {
  const result = await pool.query('DELETE FROM promotions WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}