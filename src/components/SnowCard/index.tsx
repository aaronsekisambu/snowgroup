'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import type { SnowCardData } from '@/types/content'
import { Media } from '@/components/Media'

// The one card used across the site (services, projects, products, related items), in apple.com style:
// a rounded photo, a small eyebrow, a title, a line of text and "Learn more" when it opens a page
export const SnowCard: React.FC<{ card: SnowCardData; className?: string }> = ({ card, className }) => {
  const body = (
    <>
      {card.image?.url && (
        <div className="snow-card-media">
          <Media resource={card.image} imgClassName="snow-card-img" size="(max-width: 768px) 90vw, 33vw" />
        </div>
      )}
      <div className="snow-card-body">
        {card.eyebrow && <p className="snow-card-eyebrow">{card.eyebrow}</p>}
        <h3>{card.title}</h3>
        {card.text && <p className="snow-card-text">{card.text}</p>}
        {card.url && (
          <span className="snow-card-link">
            Learn more <i className="far fa-chevron-right"></i>
          </span>
        )}
      </div>
    </>
  )
  return card.url ? (
    <Link href={card.url} className={`snow-card ${className || ''}`}>
      {body}
    </Link>
  ) : (
    <article className={`snow-card ${className || ''}`}>{body}</article>
  )
}

// A row that scrolls sideways (swipe, trackpad, or the arrow buttons), snapping card by card
export const ScrollRow: React.FC<{ children: React.ReactNode; className?: string; label?: string }> = ({ children, className, label }) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const update = () => setEdge({ start: row.scrollLeft < 8, end: row.scrollLeft + row.clientWidth > row.scrollWidth - 8 })
    update()
    row.addEventListener('scroll', update, { passive: true })
    const resize = new ResizeObserver(update)
    resize.observe(row)
    return () => {
      row.removeEventListener('scroll', update)
      resize.disconnect()
    }
  }, [])

  const page = (direction: number) => {
    const row = rowRef.current
    const item = row?.firstElementChild as HTMLElement | null
    if (!row || !item) return
    row.scrollBy({ left: direction * (item.offsetWidth + 20), behavior: 'smooth' })
  }

  return (
    <div className="snow-scroll">
      <div ref={rowRef} className={`snow-scroll-row ${className || ''}`} data-lenis-prevent-horizontal aria-label={label}>
        {children}
      </div>
      {!(edge.start && edge.end) && (
        <div className="snow-paddles">
          <button type="button" aria-label="Previous" disabled={edge.start} onClick={() => page(-1)}>
            <i className="far fa-arrow-left"></i>
          </button>
          <button type="button" aria-label="Next" disabled={edge.end} onClick={() => page(1)}>
            <i className="far fa-arrow-right"></i>
          </button>
        </div>
      )}
    </div>
  )
}
