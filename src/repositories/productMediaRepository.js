import pool from '../db/pool.js'

export async function findMediaByProduct(product_id) {
  const result = await pool.query(
    'SELECT * FROM product_media WHERE product_id = $1 ORDER BY sort_order',
    [product_id]
  )
  return result.rows
}

export async function countMediaByProductAndType(product_id, type) {
  const result = await pool.query(
    'SELECT COUNT(*) FROM product_media WHERE product_id = $1 AND type = $2',
    [product_id, type]
  )
  return parseInt(result.rows[0].count)
}

export async function createMedia({ product_id, type, url, sort_order }) {
  const result = await pool.query(
    'INSERT INTO product_media (product_id, type, url, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
    [product_id, type, url, sort_order]
  )
  return result.rows[0]
}

export async function deleteMedia(id) {
  const result = await pool.query('DELETE FROM product_media WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}

export async function deleteMediaByProduct(product_id) {
  await pool.query('DELETE FROM product_media WHERE product_id = $1', [product_id])
}