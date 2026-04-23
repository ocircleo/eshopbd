import { createOrderSchema, getOrderSchema, updateOrderStatusSchema } from '../validators/order.js'
import * as orderRepository from '../repositories/orderRepository.js'
import * as orderItemRepository from '../repositories/orderItemRepository.js'
import * as productRepository from '../repositories/productRepository.js'
import pool from '../db/pool.js'

export async function createOrder(data) {
  createOrderSchema.parse(data)

  // Check products exist and get prices
  const productIds = data.items.map(item => item.product_id)
  const products = await Promise.all(productIds.map(id => productRepository.findProductById(id)))
  const productMap = new Map(products.filter(p => p).map(p => [p.id, p]))

  if (products.some(p => !p)) {
    throw new Error('One or more products not found')
  }

  // Calculate prices
  const itemsWithPrices = data.items.map(item => ({
    ...item,
    price_at_purchase: productMap.get(item.product_id).price
  }))

  // Transaction
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const order = await orderRepository.createOrder(client, {
      name: data.name,
      phone: data.phone,
      address: data.address,
      note: data.note
    })

    await orderItemRepository.createOrderItems(client, order.id, itemsWithPrices)

    await client.query('COMMIT')
    return order
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getOrder(phone, order_id) {
  getOrderSchema.parse({ phone, order_id })

  const order = await orderRepository.findByPhoneAndId(phone, order_id)
  if (!order) {
    throw new Error('Order not found')
  }

  const items = await orderItemRepository.findByOrderId(order.id)
  return { ...order, items }
}

export async function listOrders(filters, currentUser) {
  // Admin check implicit via middleware
  const orders = await orderRepository.findAll(filters)
  const total = await orderRepository.countAll(filters)
  return { orders, total }
}

export async function updateOrder(id, updates, currentUser) {
  updateOrderStatusSchema.parse(updates)
  const order = await orderRepository.updateOrder(id, updates)
  if (!order) {
    throw new Error('Order not found')
  }
  return order
}