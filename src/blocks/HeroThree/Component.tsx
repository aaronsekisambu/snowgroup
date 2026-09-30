import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { HeroThreeBlock as HeroThreeBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const HeroThreeBlock: React.FC<HeroThreeBlockProps> = ({
  video,
  title,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  description,
  users,
}) => {
  return (
    <div className="mil-hero-3" id="top">
      {video && (
        <Media resource={video} videoClassName="mil-hero-bg mil-scale-img-top" />
      )}
      <div className="mil-overlay"></div>
      <div className="mil-hero-content mil-asterisk">
        <div className="mil-text-row-wrapper">
          <div className="mil-text-row">
            <div>
                  {title && (
                <>
                  <h1 className="mil-fs-xxl mil-c-m-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
                  <h1 className="mil-fs-xxl mil-c-m-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mil-container mil-mt-9 mil-sm-mt-4">
          <div className="row">
            <div className="col-lg-6 mil-md-mb-4">
              {button1_text && button1_url && (
                <Link href={button1_url} className="mil-btn mil-mr-4 mil-accent">
                  <span>{button1_text}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
              {button2_text && button2_url && (
                <Link href={button2_url} className="mil-btn mil-link-type">
                  <span>{button2_text}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
            <div className="col-lg-6">
              <div className="mil-flex-row mil-sm-flex-column mil-aic mil-sm-ais mil-jce">
                {description && (
                  <p
                    className="mil-t-16 mil-c-m-3 mil-tar mil-lg-tal mil-md-mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                  />
                )}
                {users && users.length > 0 && (
                  <ul className="mil-users-row mil-dark mil-ml-3 mil-sm-ml-0">
                    {users.map((user, index) => (
                      <li key={index}>
                        <Media resource={user.image} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}