import React from 'react'
import type { Service } from '@/types/content'
import type { CardServiceData } from '@/components/ServiceCard'
import { CollectionServices } from '@/components/CollectionServices'

export type RelatedPostsProps = {
  className?: string
  docs?: Service[]
  limit?: number
  postId?: string
}

export const RelatedPosts: React.FC<RelatedPostsProps> = async (props) => {
  const { docs, limit, postId } = props
  const posts: CardServiceData[] = (docs || [])
    .filter((post): post is Service => typeof post === 'object' && post.slug !== postId)
    .slice(0, limit || 3)

  return (
    <div className="mil-section mil-gray-section mil-p-10-8">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            <div className="mil-badge mil-mb-4">Other Services</div>
            <h2 className="mil-c-m-1">
              More Ways <br className="mil-sm-hidden" />
              We Can <span className="mil-opacity-text">Help</span>
            </h2>
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce">
              <p className="mil-c-m-2 mil-t-16">
                From design and engineering to construction and project management, we support every stage of your
                project, whether you are building in Uganda or from abroad.
              </p>
            </div>
          </div>
        </div>
        <CollectionServices posts={posts} />
      </div>
    </div>
  )
}
