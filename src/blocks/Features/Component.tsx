import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from "next/link"
import type { FeaturesBlock as FeaturesBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
  badge,
  title,
  description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  features,
}) => {
  return (
    <div className="mil-sticky-section mil-bg-out-left-gray" id="scroll">
      <div className="mil-sticky-part mil-p-10-10">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && <h2 className="mil-mb-5" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
          {description && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-5">
              <RichText data={description} enableGutter={false} />
            </div>
          )}
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
      <div className="mil-scroll-part mil-p-0-5">
        <div className="mil-fake-container-right mil-mt-10 mil-mb-0">
          <div className="mil-flex-column mil-aic mil-md-ais mil-w-100 mil-tac mil-md-tal mil-mb-5">
            {features?.map((feature, index) => (
              <div key={index} className="mil-flex-column mil-aic mil-md-ais mil-w-100 mil-tac mil-md-tal mil-mb-5">
                {feature.icon && (
                  <div className="mil-icon mil-mb-2">
                    <Media resource={feature.icon} />
                  </div>
                )}
                {feature.title && <h6 className="mil-mb-2 mil-c-m-1">{feature.title}</h6>}
                {feature.description && (
                  <p className="mil-t-16 mil-c-m-2 mil-mb-4 mil-w-80" dangerouslySetInnerHTML={{ __html: sanitizeHTML(feature.description) }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}