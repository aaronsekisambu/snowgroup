import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getAllProductSlugs, getProductPageBySlug } from '@/lib/content'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const product = getProductPageBySlug(decodeURIComponent(slug))
  if (!product) notFound()

  return (
    <Fragment>
      <PageClient />
      <RenderBlocks blocks={product.layout || []} />
    </Fragment>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = getProductPageBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: product, path: `/products/${slug}` })
}

export async function generateStaticParams() {
  return getAllProductSlugs()
}
