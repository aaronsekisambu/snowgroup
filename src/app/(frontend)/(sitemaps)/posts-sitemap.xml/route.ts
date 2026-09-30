import { getServerSideSitemap } from 'next-sitemap'
import { getSortedPosts } from '@/lib/content'

export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const dateFallback = new Date().toISOString()
  const sitemap = getSortedPosts().map((post) => ({
    loc: `${SITE_URL}/posts/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt || dateFallback,
  }))

  return getServerSideSitemap(sitemap)
}
