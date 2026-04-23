import pool from '../db/pool.js'

export async function findByPhone(phone) {
  const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone])
  return result.rows[0] || null
}

export async function create({ name, phone, password_hash, role, email }) {
  const result = await pool.query(
    'INSERT INTO users (name, phone, password_hash, role, email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, phone, password_hash, role, email]
  )
  return result.rows[0]
}

export async function update(id, updates) {
  const fields = []
  const values = []
  let paramIndex = 1

  if (updates.name !== undefined) {
    fields.push(`name = $${paramIndex++}`)
    values.push(updates.name)
  }
  if (updates.phone !== undefined) {
    fields.push(`phone = $${paramIndex++}`)
    values.push(updates.phone)
  }
  if (updates.email !== undefined) {
    fields.push(`email = $${paramIndex++}`)
    values.push(updates.email)
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`
  const result = await pool.query(query, values)
  return result.rows[0] || null
}

export async function deleteUser(id) {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}

export async function findAllAdmins({ search, limit = 10, offset = 0 }) {
  let query = 'SELECT id, name, phone, email, role FROM users WHERE role IN (\'admin\', \'super_admin\')'
  const params = []
  let paramIndex = 1

  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR phone ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  query += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  const result = await pool.query(query, params)
  return result.rows
}

export async function countAdmins({ search }) {
  let query = 'SELECT COUNT(*) FROM users WHERE role IN (\'admin\', \'super_admin\')'
  const params = []

  if (search) {
    query += ' AND (name ILIKE $1 OR phone ILIKE $1)'
    params.push(`%${search}%`)
  }

  const result = await pool.query(query, params)
  return parseInt(result.rows[0].count)
}