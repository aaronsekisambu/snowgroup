import React from 'react'
import Link from "next/link"
import type { ServicesTwoBlock as ServicesTwoBlockProps } from '@/types/content'
import RichText from '@/components/RichText'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const ServicesTwoBlock: React.FC<ServicesTwoBlockProps> = ({
  badge,
  title,
  description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  services,
}) => {
  return (
    <div className="mil-sticky-section mil-bg-out-left-gray" id="scroll">
      <div className="mil-sticky-part mil-p-10-10">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2
              className="mil-c-m-1 mil-mb-5"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
            />
          )}
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
        <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
          {services?.map((service, index) => (
            <div key={index} className="mil-card mil-transparent mil-angle mil-angle-gray mil-w-100 mil-md-tal mil-mb-10">
              {service.title && (
                <h4
                  className="mil-mb-4 mil-c-m-1"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.title) }}
                />
              )}
              {service.description && (
                <p
                  className="mil-t-14 mil-c-m-3 mil-mb-4"
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }}
                />
              )}
              <div className="mil-divider mil-w-100 mil-mb-3"></div>
              {service.list && service.list.length > 0 && (
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
          ))}
        </div>
      </div>
    </div>
  )
}