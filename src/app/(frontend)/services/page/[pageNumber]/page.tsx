import type { Metadata } from 'next/types'
import { CollectionServices } from '@/components/CollectionServices'
import { Pagination } from '@/components/Pagination'
import PageClient from '../../page.client'
import { notFound } from 'next/navigation'
import { getAllServices, getServices, getServicesPage } from '@/lib/content'
import type { ServicesPage } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const servicesData: ServicesPage = getServicesPage()
  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()
  const services = getServices(sanitizedPageNumber, 9)

  return (
    <>
      <PageClient />
      {servicesData.layout_before && <RenderBlocks blocks={servicesData.layout_before} />}
      <div className="mil-section mil-gray-section mil-p-10-8">
        <div className="container">
          <div className="row mil-aie mil-mb-10">
            <div className="col-12 col-md-6 mil-sm-mb-4">
              {servicesData.badge && <div className="mil-badge mil-mb-4">{servicesData.badge}</div>}
              {servicesData.title && (
                <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(servicesData.title) }} />
              )}
            </div>
            <div className="col-12 col-md-6">
              <div className="mil-flex-column mil-jce">
                {servicesData.description && (
                  <p className="mil-c-m-2 mil-t-16" dangerouslySetInnerHTML={{ __html: sanitizeHTML(servicesData.description) }} />
                )}
              </div>
            </div>
          </div>
          <CollectionServices posts={services.docs} />
          {services.totalPages > 1 && services.page && (
            <Pagination pageType={'services'} page={services.page} totalPages={services.totalPages} />
          )}
        </div>
      </div>
      {servicesData.layout_after && <RenderBlocks blocks={servicesData.layout_after} />}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const servicesData: ServicesPage = getServicesPage()
  return {
    title: `${servicesData.meta?.title} | Page ${pageNumber || ''}`,
    alternates: { canonical: `/services/page/${pageNumber}` },
  }
}

export async function generateStaticParams() {
  const totalPages = Math.ceil(getAllServices().length / 9)
  const pages: { pageNumber: string }[] = []
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
