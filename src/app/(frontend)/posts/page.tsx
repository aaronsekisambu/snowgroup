import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'
import { getBlog, getPosts } from '@/lib/content'
import type { Blog, Page as PageType } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const blogData: Blog = getBlog()
  const posts = getPosts(1, 6)

  return (
    <>
      <PageClient />
      {blogData.layout_before && <RenderBlocks blocks={blogData.layout_before} />}
      <div className="mil-section mil-gray-section mil-p-10-10">
        <div className="container">
          <div className="row mil-aie mil-mb-10">
            <div className="col-12 col-md-6 mil-sm-mb-4">
              {blogData.badge && <div className="mil-badge mil-mb-4">{blogData.badge}</div>}
              {blogData.title && (
                <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(blogData.title) }} />
              )}
            </div>
            <div className="col-12 col-md-6">
              <div className="mil-flex-column mil-jce">
                {blogData.description && (
                  <p className="mil-c-m-2 mil-t-16" dangerouslySetInnerHTML={{ __html: sanitizeHTML(blogData.description) }} />
                )}
              </div>
            </div>
          </div>
          <CollectionArchive posts={posts.docs} />
          {posts.totalPages > 1 && posts.page && (
            <Pagination pageType={'posts'} page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
      {blogData.layout_after && <RenderBlocks blocks={blogData.layout_after} />}
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const blogData: Blog = getBlog()
  const pageBlogData: PageType = {
    title: '',
    layout: [],
    meta: blogData.meta,
    slug: 'posts',
  }
  return generateMeta({ doc: pageBlogData })
}
