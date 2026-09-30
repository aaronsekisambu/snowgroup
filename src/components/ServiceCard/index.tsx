'use client'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Service } from '@/types/content'

export type CardServiceData = Pick<Service, 'slug' | 'meta' | 'title' | 'short' | 'list'>

export const ServiceCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardServiceData
  relationTo?: 'services'
  title?: string
}> = (props) => {
  const { doc, relationTo, title: titleFromProps } = props

  const { slug, meta, title, short, list } = doc || {}
  const { image: metaImage } = meta || {}
  
  const titleToUse = titleFromProps || title
  const sanitizedDescription = short?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <Link href={href} className="mil-large-card">
        <div className="mil-card-head mil-angle mil-angle-gray">
            {!metaImage && <div className="">No image</div>}
            {metaImage && 
            <Media 
                resource={metaImage} 
                size="33vw"  
            />
            }
            <div className="mil-plus">
                <i className="fal fa-plus"></i>
            </div>
        </div>
        <div className="mil-card mil-w-100 mil-md-tal mil-mb-2">
            {titleToUse && <h4 className="mil-mb-4 mil-c-m-1">{titleToUse}</h4>}
            {short && <p className="mil-t-14 mil-c-m-3 mil-mb-4 mil-3-row-max">{sanitizedDescription}</p>}
            <div className="mil-divider mil-w-100 mil-mb-3"></div>
            {list &&
            <ul className="mil-check-list">
                {list?.map((item, index) => (
                <li key={`service-list-item-${index}`}>{item.text}</li>
                ))}
            </ul>
            }
        </div>    
    </Link>
  )
}
