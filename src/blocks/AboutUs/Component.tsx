import React from 'react'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { AboutUsBlock as AboutUsBlockProps } from '@/types/content'

export const AboutUsBlock: React.FC<AboutUsBlockProps> = ({
  badge,
  title,
  description,
  portrait,
  founder_name,
  founder_role,
  founder_quote,
  image,
}) => {
  return (
    <div className="row g-0">
      <div className="col-lg-6 mil-p-10-10">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2
              className="mil-mb-5"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
            />
          )}
          {description && (
            <p
              className="mil-t-16 mil-c-m-2 mil-mb-8"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
            />
          )}
          {portrait && founder_name && founder_role && founder_quote && (
            <div className="mil-founder-quote">
              <div className="mil-portrait">
                <Media resource={portrait} />
              </div>
              <div className="mil-text">
                <div className="mil-quote-icon mil-handwrite mil-mb-2">&quot;</div>
                <div className="mil-flex-row mil-mb-3">
                  <h6 className="mil-mr-1">{founder_name}</h6>
                  <span className="mil-t-14 mil-c-m-2">/ &nbsp;&nbsp; {founder_role}</span>
                </div>
                <p
                  className="mil-handwrite"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(founder_quote) }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-6">
        {image && (
          <div className="mil-square-box mil-angle mil-angle-lg">
            <Media
              resource={image}
              imgClassName="mil-scale-img"
            />
            <div className="mil-overlay" style={{ opacity: 0.2 }}></div>
          </div>
        )}
      </div>
    </div>
  )
}