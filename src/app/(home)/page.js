import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SearchBar } from '@/components/SearchBar'

async function getPromotions() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/promotions', { cache: 'no-store' })
    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
  }
  return null // Return null to indicate error
}

async function getProducts() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/products?limit=12', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return data.products || []
    }
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
  return null // Return null to indicate error
}

function PromotionBanner({ promotions }) {
  if (!promotions || promotions.length === 0) return null

  return (
    <div className="w-full mb-8">
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg shadow-lg bg-card border border-border">
        <Image
          src={promotions[0].image_url}
          alt="Promotion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg text-primary-foreground">Special Offers</h2>
            <Link href={promotions[0].redirect_url}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products available</p>
        <p className="text-muted-foreground/70">Check back later for new products</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 bg-card border-border">
          <div className="aspect-square relative">
            {product.media && product.media.length > 0 ? (
              <Image
                src={product.media[0].url}
                alt={product.title}
                fill
                className="object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-foreground">{product.title}</h3>
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.short_description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-primary">${product.price}</span>
              <Link href={`/product/${product.id}`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 active:scale-95">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export const metadata = {
  title: 'EShopBD - Shop Quality Products Online',
  description: 'Discover amazing products at great prices. Fast delivery and excellent customer service.',
  keywords: 'online shopping, ecommerce, products, deals, delivery',
  openGraph: {
    title: 'EShopBD - Your Online Store',
    description: 'Shop quality products online with fast delivery',
    type: 'website',
  },
}

export default async function Home() {
  const [promotions, products] = await Promise.all([
    getPromotions(),
    getProducts()
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar />
        <PromotionBanner promotions={promotions} />

        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Featured Products</h2>
          <Suspense fallback={<div className="text-center py-8">Loading products...</div>}>
            <ProductGrid products={products} />
          </Suspense>
        </section>

    </div>
  )
}

