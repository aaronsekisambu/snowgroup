import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from "next/link";
import type { AboutUsTwoBlock as AboutUsTwoBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const AboutUsTwoBlock: React.FC<AboutUsTwoBlockProps> = ({
  badge,
  title,
  left_description,
  counter_value,
  counter_suffix,
  counter_title,
  right_description1,
  image,
  right_description2,
  timeline,
  right_description3,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
}) => {
  return (
    <div className="mil-sticky-section">
      <div className="mil-sticky-part mil-p-10-10">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2
              className="mil-mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
            />
          )}
          <div className="mil-w-80">
            {left_description && (
              <p
                className="mil-t-16 mil-c-m-2 mil-mb-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(left_description) }}
              />
            )}
          </div>
          {counter_value && (
            <>
              <span className="mil-counter mil-counter-3" data-number={counter_value}>
                {counter_value}
              </span>
              {counter_suffix && <span className="mil-c-a-1 mil-sub-text-2">{counter_suffix}</span>}
              {counter_title && <h6 className="mil-mt-1">{counter_title}</h6>}
            </>
          )}
        </div>
      </div>
      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-no-pad mil-mt-10 mil-mb-0">
          {right_description1 && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-4">
              <RichText data={right_description1} enableGutter={false} />
            </div>
          )}

          {image && (
            <div className="mil-image-frame mil-angle mil-mb-4">
              <Media
                resource={image}
                imgClassName="mil-scale-img"
                data-value-1="1.1"
                data-value-2="1"
              />
              <div className="mil-overlay" style={{ opacity: 0.1 }}></div>
            </div>
          )}

          {right_description2 && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-4">
              <RichText data={right_description2} enableGutter={false} />
            </div>
          )}

          {timeline && timeline.length > 0 && (
            <ul className="mil-timeline mil-mb-5">
              {timeline.map((item, index) => (
                <li key={index}>
                  <div className="mil-head mil-mb-2">
                    {item.period && <div className="mil-badge mil-mb-2">{item.period}</div>}
                    {item.head_title && <h6>{item.head_title}</h6>}
                  </div>
                  {item.description && (
                    <p
                      className="mil-t-16 mil-c-m-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.description) }}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          {right_description3 && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-4">
              <RichText data={right_description3} enableGutter={false} />
            </div>
          )}

          {button1_text && button1_url && (
            <Link href={button1_url} className="mil-btn mil-accent mil-mr-4">
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
    </div>
  )
}