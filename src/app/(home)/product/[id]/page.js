import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      <div className="aspect-square bg-muted flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
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
            <div key={index} className="flex-shrink-0 w-20 h-20 relative rounded border-2 border-border hover:border-primary transition-colors cursor-pointer">
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

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found - EShopBD'
    }
  }

  return {
    title: `${product.title} - EShopBD`,
    description: product.short_description || `Buy ${product.title} online at EShopBD`,
    openGraph: {
      title: product.title,
      description: product.short_description,
      images: product.media?.length > 0 ? [product.media[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MediaCarousel media={product.media} />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">{product.title}</h1>
              <p className="text-muted-foreground mb-4">{product.short_description}</p>
              <div className="text-3xl font-bold text-primary mb-4">${product.price}</div>
              {product.category && (
                <Badge variant="secondary" className="mb-4 bg-secondary text-secondary-foreground">
                  {product.category.name}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <Link href={`/purchase?product=${product.id}`}>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95">
                  Buy Now
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="w-full border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {product.details && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none text-foreground">
                    {typeof product.details === 'string' ? (
                      <p>{product.details}</p>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
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

    </div>
  )
}