import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'

import { breadcrumbList, JsonLd, productSchema } from '@/components/StructuredData/JsonLd'
import { Overview } from '@/components/Overview'
import { generateMeta } from '@/utilities/generateMeta'
import { getAllProductSlugs, getProductCategories, getProductOverview, getProductSpecs } from '@/lib/content'
import { categoryOverview, productOverview } from '@/lib/overview'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// /products/<slug> is a product (H6 Hollow Block …) or a category (Concrete Products …); both open as an overview
export default async function ProductPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decoded = decodeURIComponent(slug)

  const product = getProductOverview(decoded)
  const data = productOverview(decoded) || categoryOverview(decoded)
  if (!data) notFound()

  const category = getProductCategories().find((item) => item.slug === (product?.category || decoded))
  const trail = [
    ...(category && product ? [{ name: category.title, path: `/products/${category.slug}` }] : []),
    { name: data.name, path: `/products/${decoded}` },
  ]

  return (
    <Fragment>
      <JsonLd data={breadcrumbList(trail)} />
      {product && (
        <JsonLd
          data={productSchema({
            name: product.name,
            description: product.description,
            path: `/products/${product.slug}`,
            price: product.priceText,
            sku: product.code,
          })}
        />
      )}
      <Overview data={data} />
    </Fragment>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decoded = decodeURIComponent(slug)
  const product = getProductOverview(decoded)
  const category = getProductCategories().find((item) => item.slug === (product?.category || decoded))
  const data = productOverview(decoded) || categoryOverview(decoded)
  return generateMeta({
    doc: {
      meta: {
        title: `${data?.name || 'Products'} | Snow Holdings Limited`,
        description: product?.description || data?.tagline,
        image: category?.image,
      },
    },
    path: `/products/${slug}`,
  })
}

export async function generateStaticParams() {
  return [...getAllProductSlugs(), ...getProductSpecs().map((item) => ({ slug: item.slug }))]
}
