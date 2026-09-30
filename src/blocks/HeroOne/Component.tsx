import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { HeroOneBlock as HeroOneBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const HeroOneBlock: React.FC<HeroOneBlockProps> = ({
  bgImage,
  icon,
  subtitle,
  title_line1,
  title_line2,
  title_line3,
  description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  counter1_upper,
  counter1_lower,
  counter1_value,
  counter2_upper,
  counter2_lower,
  counter2_value,
}) => {
  return (
    <div className="mil-hero-1" id="top">
      {bgImage && (
        <Media
          imgClassName="mil-hero-bg mil-scale-img-top"
          resource={bgImage}
        />
      )}
      <div className="mil-overlay"></div>
      <div className="mil-hero-content">
        <div className="mil-container">
          <div className="row mil-aie">
            <div className="col-lg-8 mil-md-mb-10">
              {icon && (
                <div className="mil-icon mil-c-m-4 mil-mb-2">
                  <Media resource={icon} />
                </div>
              )}
              {subtitle && (
                <p
                  className="mil-c-m-3 mil-mb-4 mil-t-16"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(subtitle) }}
                />
              )}
              <h1 className="mil-c-m-4 mil-mb-4">
                {title_line1 && <>{title_line1}<br /></>}
                {title_line2 && <>{title_line2}<br /></>}
                {title_line3 && <span className="mil-opacity-text">{title_line3}</span>}
              </h1>
              {description && (
                <p
                  className="mil-c-m-3 mil-mb-4 mil-t-16"
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
                <Link href={button2_url} className="mil-btn mil-link-type">
                  <span>{button2_text}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
            <div className="col-lg-4">
              <a href="#scroll" className="mil-scroll-hint mil-md-hidden mil-mb-10">
                <div className="mil-mouse"></div>
                <div className="mil-text">Scroll Down</div>
              </a>
              {counter1_upper && counter1_lower && counter1_value && (
                <div className="mil-counter-box mil-mb-2">
                  <h6 className="mil-c-m-4">
                    <span className="mil-c-a-1">{counter1_upper}</span>
                    <br />
                    {counter1_lower}
                  </h6>
                  <div className="mil-c-m-4 mil-counter-1">
                    {counter1_value}
                    <span className="mil-c-a-1 mil-sub-text-2">+</span>
                  </div>
                </div>
              )}
              {counter2_upper && counter2_lower && counter2_value && (
                <div className="mil-counter-box">
                  <h6 className="mil-c-m-4">
                    <span className="mil-c-a-1">{counter2_upper}</span>
                    <br />
                    {counter2_lower}
                  </h6>
                  <div className="mil-c-a-1 mil-counter-1">
                    {counter2_value}
                    <span className="mil-c-m-4 mil-sub-text-1">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}