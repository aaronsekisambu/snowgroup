import React from 'react'

import { BlogCard, BlogCardPostData } from '@/components/BlogCard'

export type Props = {
  posts: BlogCardPostData[]
}

export const LatestPosts: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className="row">
        {posts?.map((item, key) => (
        <div className="col-12 col-md-6 col-lg-4" key={`latest-blog-item-${key}`}>
            <BlogCard doc={item} relationTo="posts" showCategories layout="default" />
        </div>
        ))}
    </div>
  )
}
