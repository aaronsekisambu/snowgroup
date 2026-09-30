import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import PageClient from '../../page.client'
import { notFound } from 'next/navigation'
import { getBlog, getPosts, getSortedPosts } from '@/lib/content'
import type { Blog } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const blogData: Blog = getBlog()
  const posts = getPosts(sanitizedPageNumber, 6)

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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const blogData: Blog = getBlog()
  return {
    title: `${blogData.meta?.title} | Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const totalPages = Math.ceil(getSortedPosts().length / 6)
  const pages: { pageNumber: string }[] = []
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
