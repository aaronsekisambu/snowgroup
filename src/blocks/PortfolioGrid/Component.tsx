import type { Project, PortfolioGrid as PortfolioGridProps } from '@/types/content'
import React from 'react'
import { ProjectsMasonry } from '@/components/ProjectsMasonry'
import { queryProjectsGridBlock } from '@/lib/content'
import type { ProjectCardPostData } from '@/components/ProjectCard'

export const PortfolioGrid: React.FC<
  PortfolioGridProps & {
    id?: string
  }
> = async (props) => {
  const { columns, categories, limit: limitFromProps, populateBy, selectedDocs, container } = props

  const limit = limitFromProps || 6

  let projects: ProjectCardPostData[] = Array.isArray((props as { items?: ProjectCardPostData[] }).items)
    ? ((props as { items?: ProjectCardPostData[] }).items as ProjectCardPostData[])
    : []

  if (!projects.length && populateBy === 'collection') {
    const flattenedCategories = (categories as { slug?: string; title?: string }[] | undefined)?.map((category) => {
      if (typeof category === 'object') return category.slug || category.title
      return String(category)
    })
    projects = queryProjectsGridBlock(flattenedCategories, limit)
  } else if (!projects.length && selectedDocs?.length) {
    projects = (selectedDocs as { value?: Project }[]).map((post) => post.value).filter(Boolean) as ProjectCardPostData[]
  }

  return (
    <section className="portfolio-section">
      <div className={container === "boxed" ? "portfolio-grid-container" : "portfolio-grid-fluid"}>
        <ProjectsMasonry projects={projects} columns={columns} layout={"grid"} />
      </div>
    </section>
  )
}