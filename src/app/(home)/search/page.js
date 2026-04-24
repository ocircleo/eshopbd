'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import useInternalFetcher from '@/utls/fetcher/useInternalFetcher'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const { data: categoriesData, isLoading: categoriesLoading } = useInternalFetcher('/api/categories')
  const categories = categoriesData || []

  const productsUrl = `/api/products?${searchParams}`
  const { data: productsData, isLoading: productsLoading } = useInternalFetcher(productsUrl)
  const products = productsData?.products || []

  const loading = categoriesLoading || productsLoading



  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category && category !== 'all') params.set('category', category)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    router.push(`/search?${params}`)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setMinPrice('')
    setMaxPrice('')
    router.push('/search')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-foreground">Search Products</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product name..."
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {(categories || []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="1000"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 active:scale-95">
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters} className="border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95">
              Clear Filters
            </Button>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {loading ? 'Loading...' : `${products.length} products found`}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-card">
                  <div className="aspect-square bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-2"></div>
                    <div className="h-6 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-muted-foreground/70">Try adjusting your search criteria</p>
            </div>
          ) : (
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
          )}
        </section>


    </div>
  )
}