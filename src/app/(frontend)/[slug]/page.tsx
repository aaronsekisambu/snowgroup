import type { Metadata } from 'next'
import { breadcrumbList, JsonLd } from '@/components/StructuredData/JsonLd'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Page } from '@/types/content'
import { getPageBySlug, getAllPageSlugs, HOME_PAGE_SLUG, TEMPLATE_PAGE_SLUGS } from '@/lib/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args): Promise<React.ReactElement | null> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page: Page | null = getPageBySlug(decodedSlug)

  if (!page) notFound()

  return (
    <Fragment>
      <PageClient page={page} />
      {!TEMPLATE_PAGE_SLUGS.includes(decodedSlug) && decodedSlug !== HOME_PAGE_SLUG && (
        <JsonLd data={breadcrumbList([{ name: page.title, path: `/${decodedSlug}` }])} />
      )}
      <RenderBlocks blocks={page.layout || []} />
    </Fragment>
  )
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllPageSlugs()
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = getPageBySlug(decodedSlug)
  return generateMeta({
    doc: page,
    path: decodedSlug === HOME_PAGE_SLUG ? '/' : `/${decodedSlug}`,
    noindex: TEMPLATE_PAGE_SLUGS.includes(decodedSlug),
  })
}
