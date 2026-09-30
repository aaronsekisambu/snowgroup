import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

// What link previews (WhatsApp, Facebook, LinkedIn, Google) show when a page sets nothing more specific
export const SITE_NAME = 'Snow Holdings Limited'
export const SITE_DESCRIPTION =
  'Snow Holdings Limited is a Ugandan construction and building materials company. We build homes, commercial and public projects, and supply concrete blocks, pavers and materials. From Vision to Value.'
export const SITE_OG_IMAGE = '/snow-og.jpg'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: SITE_DESCRIPTION,
  images: [
    {
      url: `${getServerSideURL()}${SITE_OG_IMAGE}`,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} — From Vision to Value`,
    },
  ],
  locale: 'en_UG',
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
