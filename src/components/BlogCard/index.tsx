'use client'

import Link from 'next/link'
import React, { Fragment } from 'react'
import { formatDateTime } from '@/utilities/formatDateTime'

import type { Post } from '@/types/content'

export type BlogCardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'populatedAuthors' | 'publishedAt'>

import { Media } from '@/components/Media'
import { formatAuthors, formatAuthorsAvatar } from '@/utilities/formatAuthors'

export const BlogCard: React.FC<{
  alignItems?: 'center'
  doc?: BlogCardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string,
  layout?: string,
}> = (props) => {
  const { doc, relationTo, showCategories, title: titleFromProps } = props

  const {
    slug, categories, meta, title, populatedAuthors, publishedAt,
  } = doc || {}
  const { description, image: metaImage } = meta || {}
  const authorAvatar = formatAuthorsAvatar(populatedAuthors)

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`
  
  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <>
        <Link href={href} className="mil-item-card mil-port-ori mil-angle mil-angle-gray mil-mb-2">
            <div className="row g-0 mil-w-100">
                <div className="col-12">
                    <div className="mil-cover">
                        {!metaImage && <div className="">No image</div>}
                        {metaImage && 
                        <Media 
                            resource={metaImage} 
                            size="33vw" 
                            imgClassName="mil-scale-img" 
                        />
                        }
                    </div>
                    <div className="mil-badges">
                        {showCategories && hasCategories && (
                            <div className="mil-category">
                                {showCategories && hasCategories && (
                                <div>
                                    {categories?.map((category, index) => {
                                    if (typeof category === 'object') {
                                        const { title: titleFromCategory } = category

                                        const categoryTitle = titleFromCategory || 'Untitled category'

                                        const isLast = index === categories.length - 1

                                        return (
                                        <Fragment key={index}>
                                            {categoryTitle}
                                            {!isLast && <Fragment>, &nbsp;</Fragment>}
                                        </Fragment>
                                        )
                                    }

                                    return null
                                    })}
                                </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-12">
                    <div className="mil-descr">
                        <div className="mil-text">
                            {titleToUse && <h4 className="mil-mb-2">{titleToUse}</h4>}
                            {description && <p className="mil-t-16 mil-c-m-2 mil-mb-3">{sanitizedDescription}</p>}
                            <div className="mil-btn mil-soft">
                                <span>Read more</span>
                                <i className="far fa-arrow-right"></i>
                            </div>
                        </div>
                        <div className="mil-info">
                            <ul>
                                {hasAuthors &&
                                <li>
                                    {authorAvatar &&
                                    <div className="mil-author mil-mr-2">
                                        <Media resource={authorAvatar} size="33vw" imgClassName="mil-author-img" />
                                    </div>
                                    }
                                    <p>{formatAuthors(populatedAuthors)}</p>
                                </li>
                                }
                                {publishedAt &&
                                <li>
                                    <span className="mil-icon-2 mil-mr-2">
                                      <i className="fal fa-calendar"></i>
                                    </span>
                                    <p><time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time></p>
                                </li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </>
  )
}
