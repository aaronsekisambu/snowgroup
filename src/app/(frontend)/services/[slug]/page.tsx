import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Service } from '@/types/content'
import { RelatedPosts } from '@/components/RelatedServices/Component'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getAllServiceSlugs, getServiceBySlug } from '@/lib/content'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const service = getServiceBySlug(decodeURIComponent(slug))
  if (!service) notFound()

  return (
    <Fragment>
      <PageClient />
      <RenderBlocks blocks={service.layout || []} />
      {service.relatedServices && service.relatedServices.length > 0 && (
        <RelatedPosts
          limit={3}
          docs={service.relatedServices.filter((item: Service) => typeof item === 'object')}
          postId={service.slug}
        />
      )}
    </Fragment>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const service = getServiceBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: service })
}

export async function generateStaticParams() {
  return getAllServiceSlugs()
}
