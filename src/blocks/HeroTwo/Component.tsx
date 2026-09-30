import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { HeroTwoBlock as HeroTwoBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const HeroTwoBlock: React.FC<HeroTwoBlockProps> = ({
  title,
  users,
  description,
  button_text,
  button_url,
  bgImage,
}) => {
  return (
    <div className="mil-hero-2" id="top">
      <div className="mil-hero-content">
        <div className="mil-container mil-w-100">
          <div className="row mil-aie">
            <div className="col-xl-8 mil-lg-mb-4">
              {title && (
                <h1
                  className="mil-fs-lg mil-c-m-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
                />
              )}
            </div>
            <div className="col-xl-4">
              <div className="mil-flex-column mil-aie mil-lg-ais">
                {users && users.length > 0 && (
                  <ul className="mil-users-row mil-mb-4">
                    {users.map((user, index) => (
                      <li key={index}>
                        {user.image && (
                          <Media resource={user.image} />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {description && (
                  <p
                    className="mil-t-16 mil-c-m-2 mil-tar mil-lg-tal mil-mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                  />
                )}
                {button_text && button_url && (
                  <Link href={button_url} className="mil-btn mil-link-type mil-dark">
                    <span>{button_text}</span>
                    <i className="far fa-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <a href="#scroll" className="mil-circle-text-position mil-circle-text-pad">
          <div className="mil-circle-text mil-rotate" data-value="360">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 300 300"
              enableBackground="new 0 0 300 300"
              xmlSpace="preserve"
            >
              <defs>
                <path id="circlePath" d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 " />
              </defs>
              <circle cx="150" cy="100" r="75" fill="none" />
              <g>
                <use xlinkHref="#circlePath" fill="none" />
                <text style={{ letterSpacing: '.75rem' }}>
                  <textPath xlinkHref="#circlePath">Scroll down - Scroll down - </textPath>
                </text>
              </g>
            </svg>
          </div>
          <i className="far fa-arrow-down"></i>
        </a>
      </div>
      <div className="mil-hero-banner">
        {bgImage && (
          <>
            <Media
              resource={bgImage}
              imgClassName="mil-hero-bg mil-scale-img-alt"
            />
            <div className="mil-overlay"></div>
          </>
        )}
      </div>
    </div>
  )
}