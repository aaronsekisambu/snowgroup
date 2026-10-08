import React from 'react'

import { getServerSideURL } from '@/utilities/getURL'

export const ORGANIZATION_ID = '/#organization'

// Renders Schema.org data; "<" is escaped so content can never close the script tag early
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
)

// "Home > Services > Building Construction" trail Google can show in place of the bare URL
export const breadcrumbList = (trail: { name?: string | null; path: string }[]) => {
  const url = getServerSideURL()
  const items = [{ name: 'Home', path: '/' }, ...trail]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${url}${item.path === '/' ? '' : item.path}`,
    })),
  }
}

// One Snow Holdings service, linked to the organisation that provides it
export const serviceSchema = (service: { name?: string | null; description?: string | null; path: string; image?: string | null }) => {
  const url = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: `${url}${service.path}`,
    ...(service.image && { image: service.image.startsWith('http') ? service.image : `${url}${service.image}` }),
    serviceType: service.name,
    areaServed: { '@type': 'Country', name: 'Uganda' },
    provider: { '@id': `${url}${ORGANIZATION_ID}` },
  }
}
