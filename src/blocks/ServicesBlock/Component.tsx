import React from 'react'
import Link from "next/link"
import type { ServicesBlock as ServicesBlockProps } from '@/types/content'

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  services,
}) => {
  return (
    <div className="mil-section mil-gray-section mil-p-10-8">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {title && (
              <h2
                className="mil-c-m-1"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-sm-ais">
              {description && (
                <p className="mil-c-m-2 mil-t-14 mil-mb-3" dangerouslySetInnerHTML={{ __html: description }} />
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
        <div className="row">
          {services?.map((service, index) => (
            <div key={index} className="col-md-6 col-xl-4">
              <div className="mil-card mil-angle mil-angle-gray mil-w-100 mil-md-tal mil-mb-2">
                {service.title && (
                  <h4
                    className="mil-mb-4 mil-c-m-1"
                    dangerouslySetInnerHTML={{ __html: service.title }}
                  />
                )}
                {service.description && (
                  <p
                    className="mil-t-14 mil-c-m-3 mil-mb-4"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                )}
                <div className="mil-divider mil-w-100 mil-mb-3"></div>
                {service.list && service.list?.length > 0 && (
                  <ul className="mil-check-list mil-mb-4">
                    {service.list.map((list_item, itemIndex) => (
                      <li key={itemIndex}>{list_item.item}</li>
                    ))}
                  </ul>
                )}
                <div className="mil-divider mil-w-100 mil-mb-4"></div>
                {service.button_text && service.button_url && (
                  <Link href={service.button_url} className="mil-btn mil-soft">
                    <span>{service.button_text}</span>
                    <i className="far fa-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}