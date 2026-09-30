import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/types/content'
import type { BlogCardPostData } from '@/components/BlogCard'
import { queryBlogArchivePosts } from '@/lib/content'
import React from 'react'
import Link from 'next/link'
import { LatestPosts } from '@/components/LatestPosts'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string }> = async (props) => {
  const { badge, title, description, button_text, button_url, categories, limit: limitFromProps, populateBy, selectedDocs, items } =
    props as ArchiveBlockProps & {
      items?: BlogCardPostData[]
      selectedDocs?: { value?: Post }[]
      categories?: { slug?: string; id?: string; title?: string }[]
      populateBy?: string
      limit?: number
      badge?: string
      title?: string
      description?: string
      button_text?: string
      button_url?: string
    }

  const limit = (limitFromProps as number) || 3
  let posts: BlogCardPostData[] = Array.isArray(items) ? (items as BlogCardPostData[]) : []

  if (!posts.length && populateBy === 'collection') {
    const flattenedCategories = (categories || []).map((category) =>
      typeof category === 'object' ? category.slug || category.title : String(category),
    )
    posts = queryBlogArchivePosts(flattenedCategories, limit)
  } else if (!posts.length && selectedDocs?.length) {
    posts = selectedDocs.map((post) => post.value).filter(Boolean) as BlogCardPostData[]
  }

  return (
    <div className="mil-section mil-gray-section mil-p-10-8">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-lg-6 mil-md-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{String(badge)}</div>}
            {title && (
              <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(title)) }} />
            )}
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-md-ais">
              {description && (
                <p className="mil-c-m-2 mil-t-14 mil-mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(description)) }} />
              )}
              {button_text && button_url && (
                <Link href={String(button_url)} className="mil-btn mil-link-type mil-dark">
                  <span>{String(button_text)}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
        <LatestPosts posts={posts} />
      </div>
    </div>
  )
}
