import type { Metadata } from 'next'
import type { Media, Page, Post, Project, Service, Team } from '@/types/content'
import { mergeOpenGraph, SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | string | number | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + SITE_OG_IMAGE

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    const ogUrl = image.sizes?.og?.url
    const imageUrl = ogUrl || image.url
    url = imageUrl.startsWith('http') ? imageUrl : serverUrl + imageUrl
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Project> | Partial<Service> | Partial<Team> | null
  // the page's own path, e.g. "/services/building-construction"; used as its canonical URL
  path: string
  // leftover template pages (demo team, sample blog posts) are kept out of search results
  noindex?: boolean
}): Promise<Metadata> => {
  const { doc, path, noindex } = args
  const ogImage = getImageURL(doc?.meta?.image)
  const title = doc?.meta?.title ? doc.meta.title : SITE_NAME
  const description = doc?.meta?.description || SITE_DESCRIPTION

  return {
    description,
    alternates: { canonical: path },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: mergeOpenGraph({
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: path,
    }),
    title,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
