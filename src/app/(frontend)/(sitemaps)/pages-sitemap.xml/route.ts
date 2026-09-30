import { getServerSideSitemap } from 'next-sitemap'
import { getAllPages } from '@/lib/content'
import type { Page } from '@/types/content'

export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const dateFallback = new Date().toISOString()
  const results = getAllPages()

  const defaultSitemap = [
    { loc: `${SITE_URL}/posts`, lastmod: dateFallback },
    { loc: `${SITE_URL}/projects`, lastmod: dateFallback },
    { loc: `${SITE_URL}/services`, lastmod: dateFallback },
    { loc: `${SITE_URL}/team`, lastmod: dateFallback },
  ]

  const sitemap = results
    .filter((page: Page) => Boolean(page?.slug))
    .map((page: Page) => ({
      loc: page.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`,
      lastmod: page.updatedAt || dateFallback,
    }))

  return getServerSideSitemap([...defaultSitemap, ...sitemap])
}
