import { getServerSideSitemap } from 'next-sitemap'
import { NextResponse } from 'next/server'

export async function GET() {
  // In a real app, fetch dynamic URLs from database
  const staticUrls = [
    {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/search`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      loc: `${process.env.NEXT_PUBLIC_BASE_URL}/order-status`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.5,
    },
  ]

  // For dynamic product URLs, you would fetch from database
  // const products = await getAllProducts()
  // const productUrls = products.map(product => ({
  //   loc: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`,
  //   lastmod: product.updated_at,
  //   changefreq: 'weekly',
  //   priority: 0.6,
  // }))

  const urls = [...staticUrls]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}