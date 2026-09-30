import React from 'react'
import Link from 'next/link'

import type { Post } from '@/types/content'

import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { heroImage, title } = post

  return (
    <div className="mil-hero-inner" id="top">
      {heroImage && (
          <Media
              imgClassName="mil-hero-bg mil-scale-img-top"
              resource={heroImage}
          />
      )}
      <div className="mil-overlay" style={{"opacity": ".8"}}></div>
      <div className="mil-hero-content">
          <div className="mil-container">
              <div className="row mil-aie">
                  <div className="col-lg-12 mil-tac">
                      {title && <h1 className="mil-c-m-4 mil-mb-5" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
                      <ul className="mil-breadcrumbs mil-jcc mil-w-100">
                          <li><Link href="/">Home</Link></li>
                          <li className="mil-cuttent"><a href="#.">Publication</a></li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}
