'use client';

import React from 'react'

import { Masonry } from 'react-masonry'

import { ProjectCard, ProjectCardPostData } from '@/components/ProjectCard'

export type Props = {
  projects: ProjectCardPostData[],
  columns?: string | null | undefined,
  layout?: string | null | undefined,
}

export const ProjectsMasonry: React.FC<Props> = (props) => {
  const { projects, columns, layout } = props
  
  let column_class = 'col-md-4';
  if ( columns === '2' ) {
    column_class = 'col-md-6';
  } else if ( columns === '4' ) {
    column_class = 'col-md-3';
  }

  const masonryProps = { // make sure all required component's inputs/Props keys&types match
    className: "portfolio-grid row"
  }

  return (
    <Masonry {...masonryProps}>
        {projects?.map((item, index) => (
          <div className={`portfolio-grid-item ${column_class}`} key={`portfolio-item-${index}`}>  
            <ProjectCard doc={item} columns={columns} layout={layout} relationTo="projects" />
          </div>
        ))}
    </Masonry>
  )
}