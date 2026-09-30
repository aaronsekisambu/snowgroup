'use client'

import React, { useState } from 'react'

import { ProjectCard, ProjectCardPostData } from '@/components/ProjectCard'

export type Props = {
  projects: ProjectCardPostData[]
  filters: string[]
}

const ALL = 'All'

export const ProjectsFilter: React.FC<Props> = ({ projects, filters }) => {
  const [active, setActive] = useState(ALL)

  // only offer filters that have at least one project
  const available = filters.filter((filter) => projects.some((project) => project.filters?.includes(filter)))
  const shown = active === ALL ? projects : projects.filter((project) => project.filters?.includes(active))

  return (
    <>
      <div className="mil-filter mil-mb-5" role="group" aria-label="Filter projects">
        {[ALL, ...available].map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === active ? 'mil-active' : ''}
            aria-pressed={filter === active}
            onClick={() => setActive(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="row mil-equal-cards">
        {shown.map((project) => (
          <div key={project.slug} className="col-md-6 col-lg-4">
            <ProjectCard doc={project} relationTo="projects" />
          </div>
        ))}
      </div>
    </>
  )
}
