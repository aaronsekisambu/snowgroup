import type { Metadata } from 'next/types'
import { CollectionProjects } from '@/components/CollectionProjects'
import { Pagination } from '@/components/Pagination'
import PageClient from '../../page.client'
import { notFound } from 'next/navigation'
import { getAllProjects, getProjects, getProjectsPage } from '@/lib/content'
import type { ProjectsPage } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const projectsData: ProjectsPage = getProjectsPage()
  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()
  const projects = getProjects(sanitizedPageNumber, 6)

  return (
    <>
      <PageClient />
      {projectsData.layout_before && <RenderBlocks blocks={projectsData.layout_before} />}
      <div className="mil-section mil-gray-section mil-p-10-10">
        <div className="container">
          <div className="row mil-aie mil-mb-10">
            <div className="col-12 col-md-6 mil-sm-mb-4">
              {projectsData.badge && <div className="mil-badge mil-mb-4">{projectsData.badge}</div>}
              {projectsData.title && (
                <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(projectsData.title) }} />
              )}
            </div>
            <div className="col-12 col-md-6">
              <div className="mil-flex-column mil-jce">
                {projectsData.description && (
                  <p className="mil-c-m-2 mil-t-16" dangerouslySetInnerHTML={{ __html: sanitizeHTML(projectsData.description) }} />
                )}
              </div>
            </div>
          </div>
          <CollectionProjects projects={projects.docs} columns={'3'} container="fluid" />
          {projects.totalPages > 1 && projects.page && (
            <Pagination pageType={'projects'} page={projects.page} totalPages={projects.totalPages} />
          )}
        </div>
      </div>
      {projectsData.layout_after && <RenderBlocks blocks={projectsData.layout_after} />}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const projectsData: ProjectsPage = getProjectsPage()
  return {
    title: `${projectsData.meta?.title} | Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const totalPages = Math.ceil(getAllProjects().length / 6)
  const pages: { pageNumber: string }[] = []
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
