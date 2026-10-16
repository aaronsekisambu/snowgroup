'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/Media'
import Link from "next/link"
import type { ServicesThreeBlock as ServicesThreeBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const ServicesThreeBlock: React.FC<ServicesThreeBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  services,
}) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  // the arrows know when the row is at either end
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const update = () =>
      setEdge({ start: row.scrollLeft < 8, end: row.scrollLeft + row.clientWidth > row.scrollWidth - 8 })
    update()
    row.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      row.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // one card per press, landing on the snap point
  const page = (direction: number) => {
    const row = rowRef.current
    const card = row?.querySelector<HTMLElement>('.snow-service-card')
    if (!row || !card) return
    row.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: 'smooth' })
  }

  return (
    <div className="mil-section mil-p-10-0">
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
      {/* apple.com "Get to know" cards: headline on top, photo behind, a + to open, in a row that scrolls sideways */}
      <div className="snow-service-row" ref={rowRef} data-lenis-prevent-horizontal>
        {services?.map((service, index) =>
          service.url ? (
            <Link key={index} href={service.url} className="snow-service-card">
              {service.image && <Media resource={service.image} imgClassName="snow-service-img" />}
              <div className="snow-service-text">
                {service.title && <h3 dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.title) }} />}
                {service.description && <p dangerouslySetInnerHTML={{ __html: sanitizeHTML(service.description) }} />}
              </div>
              <span className="snow-service-plus" aria-hidden="true">
                <i className="fal fa-plus"></i>
              </span>
            </Link>
          ) : null,
        )}
      </div>
      <div className="snow-paddles">
        <button type="button" aria-label="Previous" disabled={edge.start} onClick={() => page(-1)}>
          <i className="far fa-arrow-left"></i>
        </button>
        <button type="button" aria-label="Next" disabled={edge.end} onClick={() => page(1)}>
          <i className="far fa-arrow-right"></i>
        </button>
      </div>
    </div>
  )
}