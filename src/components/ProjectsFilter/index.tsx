'use client'

import React, { useState } from 'react'

import type { SnowCardData } from '@/types/content'
import { SnowCard } from '@/components/SnowCard'

export type Props = {
  projects: (SnowCardData & { slug: string; filters?: string[] })[]
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
      <div className="snow-card-grid">
        {shown.map((project) => (
          <SnowCard key={project.slug} card={project} />
        ))}
      </div>
    </>
  )
}
