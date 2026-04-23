import pool from '../db/pool.js'

export async function createOrderItems(client, order_id, items) {
  const values = []
  const params = []
  let paramIndex = 1

  items.forEach(item => {
    values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`)
    params.push(order_id, item.product_id, item.quantity, item.price_at_purchase)
  })

  const query = `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ${values.join(', ')}`
  await client.query(query, params)
}

export async function findByOrderId(order_id) {
  const result = await pool.query(
    'SELECT oi.*, p.title FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1',
    [order_id]
  )
  return result.rows
}