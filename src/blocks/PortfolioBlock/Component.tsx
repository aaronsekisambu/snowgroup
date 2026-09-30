import type { Project, PortfolioBlock as PortfolioBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import React from 'react'
import Link from "next/link";
import { queryProjectsGridBlock } from '@/lib/content'
import type { ProjectCardPostData } from '@/components/ProjectCard'
import { ProjectCard } from '@/components/ProjectCard'

export const PortfolioBlock: React.FC<
  PortfolioBlockProps & {
    id?: string
  }
> = async (props) => {
  const { 
    badge, 
    title, 
    description, 
    button_label, 
    button_link, 
    info, 
    more_label, 
    more_link, 
    categories, 
    limit: limitFromProps, 
    populateBy, 
    selectedDocs 
  } = props

  const limit = limitFromProps || 3

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
    <div className="mil-section mil-gray-section mil-p-10-10">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {title && (
              <h2
                className="mil-c-m-1"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-sm-ais">
              {description && (
                <p className="mil-c-m-2 mil-t-14 mil-mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }} />
              )}
              {button_label && button_link && (
                <Link href={button_link} className="mil-btn mil-link-type mil-dark">
                  <span>{button_label}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          {projects.map((project, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <ProjectCard doc={project} relationTo="projects" />
            </div>
          ))}
        </div>
        <div className="row mil-mt-8 mil-aic">
          <div className="col-lg-7">
            {info && <h4 className="" dangerouslySetInnerHTML={{ __html: sanitizeHTML(info) }} />}
          </div>
          <div className="col-lg-5 mil-flex-row mil-jce mil-md-jcs">
            {more_label && more_link && (
              <Link href={more_link} className="mil-btn mil-md-mt-4">
                <span>{more_label}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}