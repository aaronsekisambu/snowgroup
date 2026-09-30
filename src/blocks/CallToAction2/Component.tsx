import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { CallToAction2Block as CallToAction2BlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const CallToAction2Block: React.FC<CallToAction2BlockProps> = ({
  bgImage,
  title,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
}) => {
  return (
    <div className="mil-section mil-p-10-10">
      {bgImage && (
        <Media
          resource={bgImage}
          imgClassName="mil-bg-img mil-scale-img"
        />
      )}
      <div className="mil-overlay mil-blur"></div>
      <div className="container">
        <div className="row mil-aic">
          <div className="col-md-8">
            {title && (
              <h2
                className="mil-c-m-5 mil-sm-tac"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
              />
            )}
          </div>
          <div className="col-md-4 mil-flex-row mil-jce mil-sm-jcc mil-sm-mt-5">
            {button1_text && button1_url && (
              <Link href={button1_url} className="mil-btn mil-link-type mil-mr-4">
                <span>{button1_text}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
            {button2_text && button2_url && (
              <Link href={button2_url} className="mil-btn mil-accent">
                <span>{button2_text}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
