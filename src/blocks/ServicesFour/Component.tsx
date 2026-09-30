import React from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { ServicesFourBlock as ServicesFourBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const ServicesFourBlock: React.FC<ServicesFourBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  bgImage,
  services,
}) => {
  return (
    <div className="mil-section mil-gray-section mil-p-10-0">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {title && (
              <h2
                className="mil-c-m-1"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-sm-ais">
              {description && (
                <p className="mil-c-m-2 mil-t-14 mil-mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }} />
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
      <div className="mil-services-frame">
        {bgImage && (
          <Media
            resource={bgImage}
            imgClassName="mil-bg-img mil-scale-img"
            data-value-1="1.1"
            data-value-2="1"
          />
        )}
        <div className="container-fluid g-0">
          <div className="row g-0">
            {services?.map((service, index) => (
              <div key={index} className="col-sm-6 col-xl-3">
                {service.url && (
                  <Link href={service.url} className="mil-service-card mil-type-1">
                    <div className="mil-card-text">
                      <div className="mil-plus mil-mb-3">
                        <i className="fal fa-plus"></i>
                      </div>
                      {service.title && (
                        <h5
                          className="mil-mb-2 mil-c-m-4"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.title) }}
                        />
                      )}
                      {service.description && (
                        <p
                          className="mil-t-16 mil-c-m-3"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }}
                        />
                      )}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}