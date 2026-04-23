import { promotionSchema, updatePromotionSchema } from '../validators/promotion.js'
import * as promotionRepository from '../repositories/promotionRepository.js'
import { supabase } from '../lib/supabase.js'

export async function getPromotions() {
  return await promotionRepository.findAll()
}

export async function createPromotion(data) {
  promotionSchema.parse(data)
  return await promotionRepository.create(data)
}

export async function updatePromotion(id, data) {
  updatePromotionSchema.parse({ id, ...data })
  const promotion = await promotionRepository.update(id, data)
  if (!promotion) throw new Error('Promotion not found')
  return promotion
}

export async function deletePromotion(id) {
  const promotion = await promotionRepository.deletePromotion(id)
  if (!promotion) throw new Error('Promotion not found')
  return promotion
}

export async function uploadBanner(file) {
  // Upload to Supabase
  const fileName = `banner-${Date.now()}-${file.name}`
  const { data, error } = await supabase.storage
    .from('promotions')
    .upload(fileName, file)

  if (error) throw new Error('Upload failed: ' + error.message)

  const url = supabase.storage.from('promotions').getPublicUrl(fileName).data.publicUrl
  return url
}