import React from 'react'
import type { Project } from '@/types/content'
import type { ProjectCardPostData } from '@/components/ProjectCard'
import { ProjectCard } from '@/components/ProjectCard'

export type RelatedPostsProps = {
  className?: string
  docs?: Project[]
  limit?: number
  postId?: string
}

export const RelatedPosts: React.FC<RelatedPostsProps> = async (props) => {
  const { docs, limit, postId } = props
  const posts: ProjectCardPostData[] = (docs || [])
    .filter((post): post is Project => typeof post === 'object' && post.slug !== postId)
    .slice(0, limit || 3)

  return (
    <div className="mil-section mil-gray-section mil-p-10-10">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            <div className="mil-badge mil-mb-4">Similar Projects</div>
            <h2 className="mil-c-m-1">
              More of <br className="mil-sm-hidden" />
              Our <span className="mil-opacity-text">Work</span>
            </h2>
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce">
              <p className="mil-c-m-2 mil-t-16">
                From family homes and apartments to farm buildings, public offices and materials supply, our projects
                span Uganda. Talk to us to hear more about the work we do.
              </p>
            </div>
          </div>
        </div>
        <div className="row mil-equal-cards">
          {posts.map((project) => (
            <div key={project.slug} className="col-md-6 col-lg-4">
              <ProjectCard doc={project} relationTo="projects" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
