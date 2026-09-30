import React from 'react'
import Link from "next/link"
import { Media } from '@/components/Media'
import type { TestimonialsBlock as TestimonialsBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

// "Eng. Ntale Wilson" -> "NW": honorifics are skipped so the initials match the name
const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => part && !part.endsWith('.'))
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  testimonials,
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
        <div className="row">
          {testimonials?.map((testimonial, index) => (
            <div key={index} className="col-lg-6">
              <figure className="mil-card mil-angle mil-angle-gray mil-testimonial mil-w-100 mil-mb-2">
                <i className="fas fa-quote-left mil-testimonial-quote"></i>
                {testimonial.quote && (
                  <blockquote
                    className="mil-testimonial-text mil-c-m-1 mil-mb-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(testimonial.quote) }}
                  />
                )}
                <div className="mil-divider mil-w-100 mil-mb-4"></div>
                <figcaption className="mil-testimonial-author">
                  <div className="mil-testimonial-avatar">
                    {testimonial.image ? (
                      <Media resource={testimonial.image} />
                    ) : (
                      testimonial.name && <span>{getInitials(testimonial.name)}</span>
                    )}
                  </div>
                  <div>
                    {testimonial.name && <h6 className="mil-c-m-1 mil-mb-1">{testimonial.name}</h6>}
                    {testimonial.role && <p className="mil-t-14 mil-c-m-2">{testimonial.role}</p>}
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
