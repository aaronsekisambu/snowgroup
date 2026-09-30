import type { Metadata } from 'next/types'
import { CollectionServices } from '@/components/CollectionServices'
import PageClient from './page.client'
import { getCategoryServices, getServiceCategories, getServicesPage } from '@/lib/content'
import type { ServicesPage, Page } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const servicesData: ServicesPage = getServicesPage()
  const services = getCategoryServices()
  const categories = getServiceCategories()

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
          {categories.map((category) => (
            <div key={category.slug} className="mil-services-category">
              <div className="mil-badge mil-mb-4">{category.title}</div>
              <CollectionServices
                posts={services.filter((service) => category.items.some((item) => item.slug === service.slug))}
              />
            </div>
          ))}
        </div>
      </div>
      {servicesData.layout_after && <RenderBlocks blocks={servicesData.layout_after} />}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const servicesData: ServicesPage = getServicesPage()
  const pageServicesData: Page = {
    title: '',
    layout: [],
    meta: servicesData.meta,
    slug: 'services',
  }
  return generateMeta({ doc: pageServicesData })
}
