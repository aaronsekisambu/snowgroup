import React from 'react'

import { ProjectCardPostData } from '@/components/ProjectCard'
import { ProjectsMasonry } from '@/components/ProjectsMasonry'

export type Props = {
    projects: ProjectCardPostData[]
    columns: string,
    container: string,
}

export const CollectionProjects: React.FC<Props> = (props) => {
  const { projects, container, columns } = props

  return (
    <section className="portfolio-section">
        <div className={container === "boxed" ? "portfolio-grid-container" : "portfolio-grid-fluid"}>
            <ProjectsMasonry projects={projects} columns={columns} layout={"grid"} />
        </div>
    </section>
  )
}