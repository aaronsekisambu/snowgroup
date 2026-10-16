import type { Metadata } from 'next'
import { breadcrumbList, JsonLd, serviceSchema } from '@/components/StructuredData/JsonLd'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import { Overview } from '@/components/Overview'
import { generateMeta } from '@/utilities/generateMeta'
import { getAllServiceSlugs, getServiceBySlug } from '@/lib/content'
import { serviceOverview } from '@/lib/overview'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ServicePage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const service = getServiceBySlug(decodeURIComponent(slug))
  const data = serviceOverview(decodeURIComponent(slug))
  if (!service || !data) notFound()

  return (
    <Fragment>
      <JsonLd data={breadcrumbList([{ name: 'Services', path: '/services' }, { name: service.title, path: `/services/${service.slug}` }])} />
      <JsonLd
        data={serviceSchema({
          name: service.title,
          description: service.meta?.description || service.short,
          path: `/services/${service.slug}`,
          image: typeof service.meta?.image === 'object' ? service.meta?.image?.url : null,
        })}
      />
      <Overview data={data} />
    </Fragment>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const service = getServiceBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: service, path: `/services/${slug}` })
}

export async function generateStaticParams() {
  return getAllServiceSlugs()
}
