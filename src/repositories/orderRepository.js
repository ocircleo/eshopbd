import pool from '../db/pool.js'

export async function createOrder(client, { name, phone, address, status = 'pending', note, tracking_text }) {
  const result = await client.query(
    'INSERT INTO orders (name, phone, address, status, note, tracking_text) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, phone, address, status, note, tracking_text]
  )
  return result.rows[0]
}

export async function findByPhoneAndId(phone, order_id) {
  const result = await pool.query(
    'SELECT * FROM orders WHERE phone = $1 AND id = $2',
    [phone, order_id]
  )
  return result.rows[0] || null
}

export async function findAll({ status, phone, limit = 10, offset = 0 }) {
  let query = 'SELECT * FROM orders'
  const params = []
  let paramIndex = 1

  if (status) {
    query += ` WHERE status = $${paramIndex++}`
    params.push(status)
  }
  if (phone) {
    query += `${status ? ' AND' : ' WHERE'} phone ILIKE $${paramIndex++}`
    params.push(`%${phone}%`)
  }

  query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  const result = await pool.query(query, params)
  return result.rows
}

export async function countAll({ status, phone }) {
  let query = 'SELECT COUNT(*) FROM orders'
  const params = []
  let paramIndex = 1

  if (status) {
    query += ` WHERE status = $${paramIndex++}`
    params.push(status)
  }
  if (phone) {
    query += `${status ? ' AND' : ' WHERE'} phone ILIKE $${paramIndex}`
    params.push(`%${phone}%`)
  }

  const result = await pool.query(query, params)
  return parseInt(result.rows[0].count)
}

export async function updateOrder(id, updates) {
  const fields = []
  const values = []
  let paramIndex = 1

  if (updates.status !== undefined) {
    fields.push(`status = $${paramIndex++}`)
    values.push(updates.status)
  }
  if (updates.tracking_text !== undefined) {
    fields.push(`tracking_text = $${paramIndex++}`)
    values.push(updates.tracking_text)
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`
  const result = await pool.query(query, values)
  return result.rows[0] || null
}