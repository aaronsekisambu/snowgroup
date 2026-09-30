import Link from 'next/link'
import React from 'react'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import { getGeneral } from '@/lib/content'
import type { General } from '@/types/content'

export default async function NotFound() {
  const generalData: General = getGeneral()

  return (
    <div className="mil-hero-5 mil-hero-404" id="top">
      {generalData.not_found?.bgImage && (
        <Media imgClassName="mil-hero-bg mil-scale-img-top" resource={generalData.not_found.bgImage} />
      )}
      <div className="mil-overlay"></div>
      <div className="mil-hero-content">
        <div className="mil-container mil-tac">
          <p className="mil-c-m-3 mil-mb-4 mil-t-16">{generalData.not_found?.subtitle}</p>
          <h1
            className="mil-fs-xxxl mil-c-m-4 mil-tac mil-mb-4"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(generalData.not_found?.title ? generalData.not_found.title : ''),
            }}
          />
          <p
            className="mil-c-m-3 mil-mb-4 mil-tac mil-t-16"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(generalData.not_found?.description ? generalData.not_found.description : ''),
            }}
          />
          <Link href="/" className="mil-btn mil-accent">
            <span>Back to homepage</span>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  )
}
