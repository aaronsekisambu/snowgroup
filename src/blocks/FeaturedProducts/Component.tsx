'use client'

import React, { useRef } from 'react'
import Link from 'next/link'

import type { Block, Media as MediaType, ProductModelType } from '@/types/content'
import { Media } from '@/components/Media'
import { ProductModel, type ModelControls } from '@/components/ProductModel'
import { motionFor } from '@/components/Overview/motion'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Tile = {
  eyebrow?: string
  title: string
  text?: string
  primary?: { label: string; url: string }
  secondary?: { label: string; url: string }
  image?: MediaType
  model?: ProductModelType // a live 3D model instead of a photo
  storeys?: number
  note?: string // e.g. the price
  wide?: boolean
}

// each tile shows its model in the same pose as the hero of its own page
const TileModel: React.FC<{ model: ProductModelType; storeys?: number; label: string }> = ({ model, storeys, label }) => {
  const controls = useRef<ModelControls>({ ...motionFor(model).hero })
  return <ProductModel model={model} variant={{ storeys }} controls={controls} className="snow-tile-block" label={label} />
}

type Props = Block & {
  badge?: string
  title?: string
  tiles?: Tile[]
}

// apple.com-style home tiles: headline and two links on top, the product underneath
export const FeaturedProductsBlock: React.FC<Props> = ({ badge, title, tiles }) => {
  return (
    <div className="snow-featured">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {title && <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
          </div>
        </div>
      </div>
      <div className="snow-featured-grid">
        {tiles?.map((tile) => (
          <article key={tile.title} className={`snow-tile ${tile.wide ? 'is-wide' : ''} ${tile.image && !tile.model ? 'has-photo' : ''}`}>
            {tile.eyebrow && <p className="snow-eyebrow">{tile.eyebrow}</p>}
            <h3>{tile.title}</h3>
            {tile.text && <p className="snow-tile-sub">{tile.text}</p>}
            <div className="snow-product-actions">
              {tile.primary && (
                <Link href={tile.primary.url} className="mil-btn">
                  <span>{tile.primary.label}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
              {tile.secondary && (
                <Link href={tile.secondary.url} className="mil-btn mil-link-type">
                  <span>{tile.secondary.label}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
            {tile.note && <p className="snow-tile-note">{tile.note}</p>}
            {tile.model ? (
              <TileModel model={tile.model} storeys={tile.storeys} label={tile.title} />
            ) : (
              tile.image && (
                <div className="snow-tile-photo">
                  <Media resource={tile.image} size="(max-width: 768px) 100vw, 50vw" />
                </div>
              )
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
