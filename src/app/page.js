import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

async function getPromotions() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/promotions', { cache: 'no-store' })
    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch promotions:', error)
  }
  return []
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
  return []
}

function PromotionBanner({ promotions }) {
  if (!promotions || promotions.length === 0) return null

  return (
    <div className="w-full mb-8">
      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
        <Image
          src={promotions[0].image_url}
          alt="Promotion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Special Offers</h2>
            <Link href={promotions[0].redirect_url}>
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square relative">
            {product.media && product.media.length > 0 ? (
              <Image
                src={product.media[0].url}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.short_description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-green-600">${product.price}</span>
              <Link href={`/product/${product.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SearchBar() {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex gap-2">
        <Input placeholder="Search products..." className="flex-1" />
        <Link href="/search">
          <Button>Search</Button>
        </Link>
      </div>
    </div>
  )
}

export default async function Home() {
  const [promotions, products] = await Promise.all([
    getPromotions(),
    getProducts()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            EShopBD
          </Link>
          <nav className="flex gap-4">
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Search
            </Link>
            <Link href="/order-status" className="text-gray-600 hover:text-gray-900">
              Order Status
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar />
        <PromotionBanner promotions={promotions} />

        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductGrid products={products} />
          </Suspense>
        </section>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 EShopBD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
