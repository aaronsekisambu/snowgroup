import React from 'react'

import { BlogCard, BlogCardPostData } from '@/components/BlogCard'

export type Props = {
  posts: BlogCardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className="row">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
                <BlogCard doc={result} relationTo="posts" showCategories layout="default" />
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}
