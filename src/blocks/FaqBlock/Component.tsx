import React from 'react'
import { FaqList } from '@/components/FaqList'
import type { FaqBlock as FaqBlockProps } from '@/types/content'
import Link from "next/link"
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const FaqBlock: React.FC<FaqBlockProps> = ({
  badge,
  title,
  description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  faqs,
  gray_bg_position,
}) => {
  return (
    <div className={`mil-sticky-section mil-bg-out-${gray_bg_position || 'left'}-gray`}>
      <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2
              className="mil-mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
            />
          )}
          <div className="mil-w-80">
            {description && (
              <p
                className="mil-t-16 mil-c-m-2 mil-mb-4 mil-w-80"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
              />
            )}
          </div>
          {button1_text && button1_url && (
            <Link href={button1_url} className={`mil-btn mil-mr-4 ${gray_bg_position === 'left' ? 'mil-accent' : 'mil-dark'}`}>
              <span>{button1_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
          {button2_text && button2_url && (
            <Link href={button2_url} className="mil-btn mil-link-type mil-dark">
              <span>{button2_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
          <FaqList faqs={faqs || []} />
        </div>
      </div>
    </div>
  )
}