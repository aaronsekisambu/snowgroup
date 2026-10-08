import type { MetadataRoute } from 'next'
import {
  getAllPages,
  getAllProductSlugs,
  getAllProjectSlugs,
  getAllServiceSlugs,
  HOME_PAGE_SLUG,
  TEMPLATE_PAGE_SLUGS,
} from '@/lib/content'
import { getServerSideURL } from '@/utilities/getURL'

// Served at /sitemap.xml; lists every page meant for search results by its canonical URL
export default function sitemap(): MetadataRoute.Sitemap {
  const url = getServerSideURL()
  const lastModified = new Date()

  const pages = getAllPages()
    .filter((page) => page.slug !== HOME_PAGE_SLUG && !TEMPLATE_PAGE_SLUGS.includes(page.slug))
    .map((page) => `/${page.slug}`)

  const paths = [
    '/',
    '/services',
    '/projects',
    ...pages,
    ...getAllServiceSlugs().map(({ slug }) => `/services/${slug}`),
    ...getAllProductSlugs().map(({ slug }) => `/products/${slug}`),
    ...getAllProjectSlugs().map(({ slug }) => `/projects/${slug}`),
  ]

  return paths.map((path) => ({
    url: `${url}${path === '/' ? '' : path}`,
    lastModified,
    priority: path === '/' ? 1 : path.split('/').length === 2 ? 0.8 : 0.6,
  }))
}
