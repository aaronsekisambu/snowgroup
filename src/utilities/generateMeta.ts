import fs from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import type { Media, Page, Post, Project, Service, Team } from '@/types/content'
import { mergeOpenGraph, SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

// The 1200x630 copy made by scripts/og-images.mjs, e.g. /media/projects/a.jpg -> /media/og/projects/a.jpg
const getPreviewCopy = (url: string) => {
  const copy = url.replace(/^\/media\//, '/media/og/').replace(/\.\w+$/, '.jpg')
  return copy !== url && fs.existsSync(join(process.cwd(), 'public', copy)) ? copy : null
}

const getImage = (image: Media | string | number | null | undefined, alt: string) => {
  const serverUrl = getServerSideURL()
  const absolute = (url: string) => (url.startsWith('http') ? url : serverUrl + url)

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    const og = image.sizes?.og?.url || getPreviewCopy(image.url)
    if (og) return { url: absolute(og), width: 1200, height: 630, alt: image.alt || alt }
    return { url: absolute(image.url), width: image.width ?? undefined, height: image.height ?? undefined, alt: image.alt || alt }
  }

  return { url: serverUrl + SITE_OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — From Vision to Value` }
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Project> | Partial<Service> | Partial<Team> | null
  // the page's own path, e.g. "/services/building-construction"; used as its canonical URL
  path: string
  // leftover template pages (demo team, sample blog posts) are kept out of search results
  noindex?: boolean
}): Promise<Metadata> => {
  const { doc, path, noindex } = args
  const title = doc?.meta?.title ? doc.meta.title : SITE_NAME
  const image = getImage(doc?.meta?.image, title)
  const description = doc?.meta?.description || SITE_DESCRIPTION

  return {
    description,
    alternates: { canonical: path },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: mergeOpenGraph({
      description,
      images: [image],
      title,
      url: path,
    }),
    title,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  }
}
