'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import type { OverviewData } from '@/types/content'
import { ProductModel, type ModelControls } from '@/components/ProductModel'
import { Media } from '@/components/Media'
import { ScrollRow, SnowCard } from '@/components/SnowCard'
import { PriceListBlock } from '@/blocks/PriceList/Component'
import { motionFor } from './motion'

// apple.com-style overview page, used for products, product categories, services and projects:
// a product bar, a 3D hero, highlights, a pinned scroll story where the model comes apart,
// photos, a model to turn by hand, details, related pages and a closing call to action
export const Overview: React.FC<{ data: OverviewData }> = ({ data }) => {
  const motion = useMemo(() => motionFor(data.model), [data.model])
  const hero = useRef<ModelControls>({ ...motion.hero })
  const story = useRef<ModelControls>({ ...motion.story })
  const viewer = useRef<ModelControls>({ ...motion.viewer })
  const variant = { storeys: data.storeys }

  const storyRef = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const [view, setView] = useState(0)
  const steps = data.story.length

  // the story section stays pinned while it scrolls past; progress drives the model and the headline
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = storyRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const p = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight), 0), 1)
      motion.play(story.current, p)
      setStep(Math.min(steps - 1, Math.floor(p * steps)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [motion, steps])

  const showView = (index: number) => {
    setView(index)
    Object.assign(viewer.current, motion.views[index].controls)
  }

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'closer-look', label: 'Closer look' },
    data.details && { id: 'details', label: data.compare ? 'Specs' : 'Details' },
    (data.compare || data.related) && { id: 'more', label: data.compare ? 'Compare' : 'More' },
  ].filter(Boolean) as { id: string; label: string }[]

  return (
    <div className="snow-product">
      {/* product bar under the main navigation, as on apple.com product pages */}
      <nav className="snow-localnav" aria-label={data.name}>
        <div className="snow-localnav-inner">
          <span className="snow-localnav-title">{data.name}</span>
          <div className="snow-localnav-links">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>{section.label}</a>
            ))}
            <Link href={data.primary.url} className="snow-pill">{data.priceLine ? 'Order' : 'Contact'}</Link>
          </div>
        </div>
      </nav>

      <section className="snow-product-hero" id="overview">
        <div className="snow-product-hero-text">
          {data.eyebrow && <p className="snow-eyebrow">{data.eyebrow}</p>}
          <h1>{data.name}</h1>
          <p className="snow-product-sub">{data.tagline}</p>
          <div className="snow-product-actions">
            <Link href={data.primary.url} className="mil-btn">
              <span>{data.primary.label}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
            {data.secondary && (
              <Link href={data.secondary.url} className="mil-btn mil-link-type">
                <span>{data.secondary.label}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
          </div>
          {data.priceLine && <p className="snow-product-price">{data.priceLine}</p>}
        </div>
        <ProductModel model={data.model} variant={variant} controls={hero} className="snow-product-hero-block" label={`3D view of ${data.name}`} />
      </section>

      {data.highlights.length > 0 && (
        <section className="snow-product-section">
          <div className="container">
            <h2 className="snow-product-heading">Get the highlights.</h2>
            <div className="snow-highlights">
              {data.highlights.map((item) => (
                <article key={item.title} className="snow-highlight">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {steps > 0 && (
        <section className="snow-story" id="inside" ref={storyRef} style={{ height: `${120 + steps * 70}vh` }} aria-label={`How ${data.name} comes together`}>
          <div className="snow-story-sticky">
            <div className="snow-story-text" aria-live="polite">
              {data.story.map((item, i) => (
                <div key={item.title} className={`snow-story-step ${i === step ? 'is-active' : ''}`}>
                  <span className="snow-story-count">{String(i + 1).padStart(2, '0')} / {String(steps).padStart(2, '0')}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
            <ProductModel model={data.model} variant={variant} framing={motion.framing} controls={story} className="snow-story-block" label={`${data.name} coming apart, layer by layer`} />
          </div>
        </section>
      )}

      {data.gallery && data.gallery.images.length > 0 && (
        <section className="snow-product-section snow-gallery-section">
          <div className="container">
            <h2 className="snow-product-heading">{data.gallery.title}</h2>
          </div>
          <ScrollRow className="snow-gallery" label={data.gallery.title}>
            {data.gallery.images.map(({ image, caption }) => (
              <figure key={image.url} className="snow-gallery-item">
                <Media resource={image} imgClassName="snow-gallery-img" size="(max-width: 768px) 85vw, 70vw" />
                {caption && <figcaption>{caption}</figcaption>}
              </figure>
            ))}
          </ScrollRow>
        </section>
      )}

      <section className="snow-product-section snow-viewer" id="closer-look">
        <div className="container">
          <h2 className="snow-product-heading">Take a closer look.</h2>
          <div className="snow-viewer-stage">
            <ProductModel model={data.model} variant={variant} framing={motion.framing} controls={viewer} interactive className="snow-viewer-block" label={`${data.name}, drag to turn`} />
            <div className="snow-viewer-controls">
              <div className="snow-segmented" role="group" aria-label="View">
                {motion.views.map((item, i) => (
                  <button key={item.label} type="button" aria-pressed={view === i} onClick={() => showView(i)}>
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="snow-viewer-hint">Drag to turn</span>
            </div>
          </div>
        </div>
      </section>

      {(data.included || data.cards) && (
        <section className="snow-product-section">
          <div className="container">
            {data.cards && (
              <>
                <h2 className="snow-product-heading">{data.cards.title}</h2>
                <div className="snow-highlights snow-deliverables">
                  {data.cards.items.map((card) => (
                    <article key={card.title} className="snow-highlight">
                      <h3>{card.title}</h3>
                      {card.text && <p>{card.text}</p>}
                    </article>
                  ))}
                </div>
              </>
            )}
            {data.included && (
              <div className="snow-included">
                <h2 className="snow-product-heading">{data.included.title}</h2>
                <ul>
                  {data.included.items.map((item) => (
                    <li key={item}>
                      <i className="far fa-check"></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {data.details && data.details.items.length > 0 && (
        <section className="snow-product-section" id="details">
          <div className="container">
            <h2 className="snow-product-heading">{data.details.title}</h2>
            <dl className="snow-specs">
              {data.details.items.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>
                    {item.value}
                    {item.note && <span>{item.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {data.priceList && (
        <PriceListBlock
          blockType="price_list"
          badge="Prices"
          price_list={data.priceList}
          button_text="See full price list"
          button_url="/price-list"
        />
      )}

      {data.compare && (
        <section className="snow-product-section snow-compare-section" id="more">
          <div className="container">
            <h2 className="snow-product-heading">{data.compare.title}</h2>
            <div className="snow-compare">
              {data.compare.rows.map((item) => (
                <article key={item.type} className={`snow-compare-card ${item.current ? 'is-current' : ''}`}>
                  <h3>{item.type}</h3>
                  <p className="snow-compare-size">{item.size} mm</p>
                  <p className="snow-compare-price">UGX {item.price}</p>
                  <p className="snow-compare-unit">{data.compare?.unit}</p>
                  {item.current ? (
                    <span className="snow-compare-badge">You are here</span>
                  ) : (
                    <Link href={item.url ? `/products/${item.url}` : '/price-list'} className="mil-btn mil-link-type">
                      <span>{item.url ? 'Learn more' : 'See price'}</span>
                      <i className="far fa-arrow-right"></i>
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {data.work && data.work.items.length > 0 && (
        <section className="snow-product-section">
          <div className="container">
            <h2 className="snow-product-heading">{data.work.title}</h2>
          </div>
          <ScrollRow className="snow-card-row" label={data.work.title}>
            {data.work.items.map((card) => (
              <SnowCard key={card.title} card={card} />
            ))}
          </ScrollRow>
        </section>
      )}

      {data.related && data.related.items.length > 0 && (
        <section className="snow-product-section" id={data.compare ? undefined : 'more'}>
          <div className="container">
            <h2 className="snow-product-heading">{data.related.title}</h2>
          </div>
          <ScrollRow className="snow-card-row" label={data.related.title}>
            {data.related.items.map((card) => (
              <SnowCard key={card.title} card={card} />
            ))}
          </ScrollRow>
        </section>
      )}

      <section className="snow-product-cta">
        <div className="container">
          <h2>{data.cta.title}</h2>
          <p>{data.cta.text}</p>
          <div className="snow-product-actions">
            <Link href={data.primary.url} className="mil-btn">
              <span>{data.primary.label}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
            {data.cta.secondary && (
              <Link href={data.cta.secondary.url} className="mil-btn mil-link-type">
                <span>{data.cta.secondary.label}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
