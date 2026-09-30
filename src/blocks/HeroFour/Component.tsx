import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { HeroFourBlock as HeroFourBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const HeroFourBlock: React.FC<HeroFourBlockProps> = ({
  icon,
  subtitle,
  title,
  description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  bgImage,
}) => {
  return (
    <div className="mil-hero-4" id="top">
      <div className="mil-container">
        <div className="row mil-aie">
          <div className="col-lg-6 mil-md-mb-10">
            <div className="mil-hero-content mil-asterisk">
              <div>
                {icon && (
                  <div className="mil-icon mil-c-m-1 mil-mb-2">
                    <Media resource={icon} />
                  </div>
                )}
                {subtitle && (
                  <p className="mil-c-m-2 mil-mb-4 mil-t-16">{subtitle}</p>
                )}
                {title && (
                  <h1
                    className="mil-c-m-1 mil-mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
                  />
                )}
                {description && (
                  <p
                    className="mil-c-m-2 mil-mb-4 mil-t-16"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
                  />
                )}
                <div className="mil-divider mil-mb-4"></div>
                {button1_text && button1_url && (
                  <Link href={button1_url} className="mil-btn mil-mr-4 mil-accent">
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
          </div>
          <div className="col-lg-6">
            {bgImage && (
              <div className="mil-hero-banner mil-angle mil-angle-lg">
                <Media
                  resource={bgImage}
                  imgClassName="mil-hero-bg mil-scale-img-top"
                  data-value-1="1"
                  data-value-2="1.15"
                />
                <div className="mil-overlay"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}