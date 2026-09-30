'use client'

import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { AboutProjectBlock as AboutProjectBlockProps, Media as MediaType } from '@/types/content'

export const AboutProjectBlock: React.FC<AboutProjectBlockProps> = ({
  badge,
  title,
  info_items,
  intro_title,
  intro_description,
  image,
  approach_title,
  approach_description,
  delivered_title,
  delivered_items,
  goals_title,
  goals_items,
  results_title,
  results_items,
  gallery_title,
  gallery,
  conclusion_title,
  conclusion_description,
}) => {
  return (
    <div className="mil-sticky-section mil-bg-out-left-gray mil-md-white">
      <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2 className="mil-mb-5" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
          )}
          {info_items && info_items.length > 0 && (
            <ul className="mil-half-list">
              {info_items.map((item, index) => (
                <li key={index} className="mil-mb-3">
                  <p className="mil-c-m-2">{item.label}:</p>
                  <div className="mil-dots"></div>
                  {item.url ? (
                    <a href={item.url} className="mil-text-link">
                      {item.value}
                    </a>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
          {intro_title && <h3 className="mil-mb-5">{intro_title}</h3>}

          {intro_description && (
            <div className={`mil-t-16 mil-c-m-2 mil-mb-5`}>
                <RichText data={intro_description} enableGutter={false} />
            </div>
          )}

          {image && (
            <div className="mil-image-frame mil-angle mil-mb-5">
              <Media
                resource={image}
                imgClassName="mil-scale-img"
                data-value-1="1.1"
                data-value-2="1"
              />
              <div className="mil-overlay" style={{ opacity: 0.2 }}></div>
            </div>
          )}

          {approach_title && <h5 className="mil-mb-5">{approach_title}</h5>}
          {approach_description && (
            <div className={`mil-t-16 mil-c-m-2 mil-mb-5`}>
                <RichText data={approach_description} enableGutter={false} />
            </div>
          )}

          {delivered_title && <h5 className="mil-mb-2">{delivered_title}</h5>}
          {delivered_items && delivered_items.length > 0 && (
            <ul className="mil-check-list mil-mb-5">
              {delivered_items.map((item, i) => (
                <li key={i} className="mil-t-16 mil-c-m-2">
                  <span className="mil-c-m-1">
                    <b>{item.title}</b>
                  </span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          )}

          {goals_title && <h5 className="mil-mb-2">{goals_title}</h5>}
          {goals_items && goals_items.length > 0 && (
            <ul className="mil-check-list mil-mb-5">
              {goals_items.map((item, i) => (
                <li key={i} className="mil-t-16 mil-c-m-2">
                  <span className="mil-c-m-1">
                    <b>{item.title}</b>
                  </span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          )}

          {results_title && <h5 className="mil-mb-2">{results_title}</h5>}
          {results_items && results_items.length > 0 && (
            <ul className="mil-check-list mil-mb-5">
              {results_items.map((item, i) => (
                <li key={i} className="mil-t-16 mil-c-m-2">
                  <span className="mil-c-m-1">
                    <b>{item.title}</b>
                  </span>{" "}
                  {item.description}
                </li>
              ))}
            </ul>
          )}

          {gallery_title && <h5 className="mil-mb-4">{gallery_title}</h5>}
          {gallery && gallery.length > 0 && (
            <div className="mil-project-gallery mil-mb-5">
              {gallery.map((photo: MediaType, i: number) => (
                <div key={i} className="mil-project-gallery-item">
                  <Media resource={photo} imgClassName="mil-scale-img" />
                </div>
              ))}
            </div>
          )}

          {conclusion_title && <h3 className="mil-mb-5">{conclusion_title}</h3>}
          {conclusion_description && (
            <div className={`mil-t-16 mil-c-m-2`}>
                <RichText data={conclusion_description} enableGutter={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}