import type { Metadata } from 'next'
import React from 'react'
import { notFound } from 'next/navigation'
import { RelatedPosts } from '@/components/RelatedPosts/Component'
import type { Post, Blog, Category } from '@/types/content'
import { PostHero } from '@/components/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getBlog, getPostBySlug, getAllPostSlugs } from '@/lib/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import RichText from '@/components/RichText'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)
  const blogData: Blog = getBlog()

  if (!post) notFound()

  const hasAuthors =
    post.populatedAuthors && post.populatedAuthors.length > 0 && formatAuthors(post.populatedAuthors) !== ''

  return (
    <>
      <PageClient />
      <PostHero post={post} />
      <div className="mil-sticky-section mil-bg-out-left-gray mil-md-white">
        <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
          <div className="mil-fake-container-left">
            <div className="mil-badge mil-mb-4">Publication</div>
            <h2 className="mil-mb-5">
              Why Companies Choose <br className="mil-md-hidden" />
              Business Consulting
            </h2>
            <ul className="mil-half-list">
              {post.publishedAt && (
                <li className="mil-mb-3">
                  <p className="mil-c-m-2">Date:</p>
                  <div className="mil-dots"></div>
                  <p>
                    <time dateTime={post.publishedAt}>{formatDateTime(post.publishedAt)}</time>
                  </p>
                </li>
              )}
              {hasAuthors && (
                <li className="mil-mb-3">
                  <p className="mil-c-m-2">Author:</p>
                  <div className="mil-dots"></div>
                  <p>{formatAuthors(post.populatedAuthors)}</p>
                </li>
              )}
              {post.categories && post.categories.length > 0 && (
                <li>
                  <p className="mil-c-m-2">Category:</p>
                  <div className="mil-dots"></div>
                  <span className="mil-dark">
                    {post.categories?.map((category: Category, index: number) => {
                      if (typeof category === 'object' && category !== null) {
                        const titleToUse = category.title || 'Untitled category'
                        const isLast = index === (post.categories?.length || 0) - 1
                        return (
                          <React.Fragment key={index}>
                            {titleToUse}
                            {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                          </React.Fragment>
                        )
                      }
                      return null
                    })}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mil-scroll-part mil-p-0-10">
          <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
            <RichText className="mil-t-16 mil-c-m-2" data={post.content} enableGutter={false} />
          </div>
        </div>
      </div>
      {blogData.post_layout_after && <RenderBlocks blocks={blogData.post_layout_after} />}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <RelatedPosts
          limit={3}
          docs={post.relatedPosts.filter((related: Post) => typeof related === 'object')}
          postId={post.slug}
        />
      )}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await getPostBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: post })
}

export async function generateStaticParams() {
  return getAllPostSlugs()
}
