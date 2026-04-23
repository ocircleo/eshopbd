import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

async function getProduct(id) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/products/${id}`, { cache: 'no-store' })
    if (res.ok) {
      return await res.json()
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
  }
  return null
}

function MediaCarousel({ media }) {
  if (!media || media.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <Image
          src={media[0].url}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />
      </div>
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-20 h-20 relative rounded border-2 border-gray-200">
              <Image
                src={item.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MediaCarousel media={product.media} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product.short_description}</p>
              <div className="text-3xl font-bold text-green-600 mb-4">${product.price}</div>
              {product.category && (
                <Badge variant="secondary" className="mb-4">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <Link href={`/purchase?product=${product.id}`}>
                <Button size="lg" className="w-full">
                  Buy Now
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {product.details && (
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {typeof product.details === 'string' ? (
                      <p>{product.details}</p>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(product.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 EShopBD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}