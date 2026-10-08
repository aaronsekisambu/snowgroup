import type { Metadata } from 'next/types'
import { ProjectsFilter } from '@/components/ProjectsFilter'
import PageClient from './page.client'
import { getAllProjects, getProjectsPage } from '@/lib/content'
import type { ProjectsPage, Page } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const projectsData: ProjectsPage = getProjectsPage()
  const projects = getAllProjects()

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
          <ProjectsFilter projects={projects} filters={projectsData.filters || []} />
        </div>
      </div>
      {projectsData.layout_after && <RenderBlocks blocks={projectsData.layout_after} />}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const projectsData: ProjectsPage = getProjectsPage()
  const pageProjectsData: Page = {
    title: '',
    layout: [],
    meta: projectsData.meta,
    slug: 'projects',
  }
  return generateMeta({ doc: pageProjectsData, path: '/projects' })
}
