'use client'

import Link from 'next/link'
import React from 'react'

import type { Project } from '@/types/content'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

export type ProjectCardPostData = Pick<Project, 'slug' | 'meta' | 'title' | 'publishedAt' | 'short_description' | 'price'>

export const Project2Card: React.FC<{
  doc?: ProjectCardPostData
  relationTo?: 'projects',
  columns?: string | null | undefined,
  layout?: string | null | undefined,
  title?: string,
}> = (props) => {
  const { doc, relationTo, title: titleFromProps } = props

  const { slug, meta, title, publishedAt, short_description, price } = doc || {}
  const { image: metaImage } = meta || {}

  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  return (
    <>
      <Link href={href} className="mil-item-card mil-angle mil-angle-gray mil-mb-2">
          <div className="row g-0 mil-w-100">
            <div className="col-lg-4">
                  <div className="mil-cover">
                      {!metaImage && <div className="">No image</div>}
                      {metaImage && 
                      <Media 
                          resource={metaImage} 
                          size="33vw" 
                      />
                      }
                  </div>
              </div>
              <div className="col-lg-8">
                  <div className="mil-descr">
                      <div className="mil-text">
                          {titleToUse && <h4 className="mil-mb-2">{titleToUse}</h4>}
                          {short_description && <p className="mil-t-16 mil-c-m-2 mil-mb-3">{short_description}</p>}
                          <div className="mil-btn mil-soft">
                              <span>Read more</span>
                              <i className="far fa-arrow-right"></i>
                          </div>
                      </div>
                      <div className="mil-info">
                          <ul>
                              {publishedAt &&
                              <li>
                                  <span className="mil-icon-2 mil-mr-2">
                                    <i className="fal fa-calendar"></i>
                                  </span>
                                  <p><time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time></p>
                              </li>
                              }
                              {price &&
                              <li>
                                  <span className="mil-icon-2 mil-mr-2">
                                    <i className="fal fa-tag"></i>
                                  </span>
                                  <p>{price}</p>
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
