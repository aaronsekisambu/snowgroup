'use client'

import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Team } from '@/types/content'

export type CardTeamData = Pick<Team, 'slug' | 'meta' | 'title' | 'short'>

export const TeamCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardTeamData
  relationTo?: 'team'
  title?: string
  angleGray?: boolean
}> = (props) => {
  const { doc, relationTo, title: titleFromProps, angleGray } = props
  
  const { slug, meta, title, short } = doc || {}
  const { image: metaImage } = meta || {}
  
  const titleToUse = titleFromProps || title
  const sanitizedDescription = short?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <Link href={href} className={`mil-team-card mil-angle ${angleGray ? 'mil-angle-gray' : ''} mil-mb-4`}>
        <div className="mil-portrait mil-mb-4 mil-sm-mb-2">
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
        <div className="mil-description">
            {titleToUse && <h6 className="mil-mb-1">{titleToUse}</h6>}
            {short && <p className="mil-c-m-2">{sanitizedDescription}</p>}
        </div>    
    </Link>
  )
}
