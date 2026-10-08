import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

// Served at /robots.txt
export default function robots(): MetadataRoute.Robots {
  const url = getServerSideURL()

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  }
}
