import pool from '../db/pool.js'

export async function findAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY id')
  return result.rows
}

export async function findCategoryById(id) {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function createCategory({ name }) {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
    [name]
  )
  return result.rows[0]
}

export async function updateCategory(id, { name }) {
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  )
  return result.rows[0] || null
}

export async function deleteCategory(id) {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}