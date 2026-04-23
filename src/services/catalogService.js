import { categorySchema, productSchema, updateProductSchema, mediaUploadSchema } from '../validators/catalog.js'
import * as categoryRepository from '../repositories/categoryRepository.js'
import * as productRepository from '../repositories/productRepository.js'
import * as productMediaRepository from '../repositories/productMediaRepository.js'
import { supabase } from '../lib/supabase.js'

export async function getCategories() {
  return await categoryRepository.findAllCategories()
}

export async function createCategory(data) {
  categorySchema.parse(data)
  return await categoryRepository.createCategory(data)
}

export async function updateCategory(id, data) {
  categorySchema.parse(data)
  const category = await categoryRepository.updateCategory(id, data)
  if (!category) throw new Error('Category not found')
  return category
}

export async function deleteCategory(id) {
  // Check if category has products
  const productsCount = await productRepository.countProducts({ category_id: id })
  if (productsCount > 0) {
    throw new Error('Cannot delete category with existing products')
  }
  const category = await categoryRepository.deleteCategory(id)
  if (!category) throw new Error('Category not found')
  return category
}

export async function getProducts(filters) {
  const products = await productRepository.findAllProducts(filters)
  const total = await productRepository.countProducts(filters)
  return { products, total }
}

export async function createProduct(data) {
  productSchema.parse(data)
  // Check category exists
  const category = await categoryRepository.findCategoryById(data.category_id)
  if (!category) throw new Error('Category not found')
  return await productRepository.createProduct(data)
}

export async function updateProduct(id, data) {
  updateProductSchema.parse({ id, ...data })
  if (data.category_id) {
    const category = await categoryRepository.findCategoryById(data.category_id)
    if (!category) throw new Error('Category not found')
  }
  const product = await productRepository.updateProduct(id, data)
  if (!product) throw new Error('Product not found')
  return product
}

export async function deleteProduct(id) {
  // Delete media first
  await productMediaRepository.deleteMediaByProduct(id)
  const product = await productRepository.deleteProduct(id)
  if (!product) throw new Error('Product not found')
  return product
}

export async function uploadMedia(product_id, type, file) {
  // Check product exists
  const product = await productRepository.findProductById(product_id)
  if (!product) throw new Error('Product not found')

  // Check constraints
  const currentCount = await productMediaRepository.countMediaByProductAndType(product_id, type)
  if (type === 'image' && currentCount >= 5) {
    throw new Error('Maximum 5 images per product')
  }
  if (type === 'video' && currentCount >= 1) {
    throw new Error('Maximum 1 video per product')
  }

  // Upload to Supabase
  const fileName = `${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('product-media')
    .upload(fileName, file)

  if (error) throw new Error('Upload failed: ' + error.message)

  const url = supabase.storage.from('product-media').getPublicUrl(fileName).data.publicUrl

  // Get next sort_order
  const existingMedia = await productMediaRepository.findMediaByProduct(product_id)
  const maxSort = existingMedia.length > 0 ? Math.max(...existingMedia.map(m => m.sort_order)) : 0
  const sort_order = maxSort + 1

  // Save to DB
  return await productMediaRepository.createMedia({ product_id, type, url, sort_order })
}

export async function deleteMedia(id) {
  const media = await productMediaRepository.deleteMedia(id)
  if (!media) throw new Error('Media not found')
  // Optionally delete from Supabase storage
  // For now, leave it
  return media
}

export async function getProductMedia(product_id) {
  return await productMediaRepository.findMediaByProduct(product_id)
}