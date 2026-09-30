import React from 'react'
import Link from 'next/link'
import type { Team } from '@/types/content'
import type { CardTeamData } from '@/components/TeamCard'
import { CollectionTeam } from '@/components/CollectionTeam'

export type RelatedPostsProps = {
  className?: string
  docs?: Team[]
  limit?: number
  postId?: string
}

export const RelatedPosts: React.FC<RelatedPostsProps> = async (props) => {
  const { docs, limit, postId } = props
  const posts: CardTeamData[] = (docs || [])
    .filter((post): post is Team => typeof post === 'object' && post.slug !== postId)
    .slice(0, limit || 4)

  return (
    <div className="mil-section mil-gray-section mil-p-10-6">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            <div className="mil-badge mil-mb-4">Our Team</div>
            <h2 className="mil-c-m-1">
              Discover Other <br className="mil-sm-hidden" />
              <span className="mil-opacity-text">Professionals</span> on Our Team
            </h2>
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-md-ais">
              <p className="mil-c-m-2 mil-t-14 mil-mb-3">Expert guidance. Results you trust.</p>
              <Link href="/team" className="mil-btn mil-link-type mil-dark">
                <span>View all</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
        <CollectionTeam posts={posts} angleGray={true} />
      </div>
    </div>
  )
}
