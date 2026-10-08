import React from 'react'

import { getFooter, getProductCategories } from '@/lib/content'
import { getServerSideURL } from '@/utilities/getURL'
import { SITE_DESCRIPTION, SITE_NAME } from '@/utilities/mergeOpenGraph'
import { JsonLd, ORGANIZATION_ID } from './JsonLd'

// Schema.org data Google reads to understand who runs the site and which pages are its main sections
export const StructuredData: React.FC = () => {
  const url = getServerSideURL()
  const footer = getFooter()
  const office = footer.locations?.find((location) => location.email)

  // main sections, in the order they should appear as sitelinks
  const sections = [
    { name: 'Services', path: '/services' },
    ...getProductCategories().map((category) => ({ name: category.title, path: `/products/${category.slug}` })),
    { name: 'Projects', path: '/projects' },
    { name: 'Plans', path: '/plans' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // a GeneralContractor is a local business, so Google can also show it in Maps and local results
        '@type': 'GeneralContractor',
        '@id': `${url}${ORGANIZATION_ID}`,
        name: SITE_NAME,
        alternateName: ['Snow Holdings', 'Snow Group'],
        url,
        logo: `${url}/icon-512.png`,
        image: `${url}/snow-og.jpg`,
        description: SITE_DESCRIPTION,
        email: office?.email,
        telephone: '+49 15679 137020',
        areaServed: { '@type': 'Country', name: 'Uganda' },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Acacia Mall, 4th Floor, 14-18 Cooper Road, Kisimenti',
          addressLocality: 'Kampala',
          addressCountry: 'UG',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+49 15679 137020',
          email: office?.email,
          areaServed: 'UG',
          availableLanguage: 'English',
        },
        sameAs: (footer.social || [])
          .map((item) => item.link)
          .filter((link): link is string => Boolean(link?.startsWith('https://www.linkedin.com'))),
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        name: SITE_NAME,
        url,
        inLanguage: 'en-UG',
        publisher: { '@id': `${url}${ORGANIZATION_ID}` },
      },
      {
        '@type': 'ItemList',
        '@id': `${url}/#navigation`,
        name: 'Main navigation',
        itemListElement: sections.map((section, i) => ({
          '@type': 'SiteNavigationElement',
          position: i + 1,
          name: section.name,
          url: `${url}${section.path}`,
        })),
      },
    ],
  }

  return <JsonLd data={graph} />
}
