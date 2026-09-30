import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import Link from "next/link";
import type { AboutServiceBlock as AboutServiceBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const AboutServiceBlock: React.FC<AboutServiceBlockProps> = ({
  badge,
  title,
  intro_text,
  counter_value,
  counter_suffix,
  counter_label,
  button_text,
  button_url,
  right_title,
  description,
  features,
  process_title,
  process_steps,
  deliverables_title,
  deliverables,
  side_image,
}) => {
  const hasFeatureImages = features?.some((item) => item.image)

  return (
    <div className="mil-sticky-section mil-bg-out-left-gray">
      <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2 className="mil-mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
          )}
          {intro_text && (
            <div className="mil-w-80">
              <p className="mil-t-16 mil-c-m-2 mil-mb-3 mil-w-80">{intro_text}</p>
            </div>
          )}
          {counter_value && (
            <>
              <span className="mil-counter mil-counter-3" data-number={counter_value}>
                {counter_value}
              </span>
              {counter_suffix && <span className="mil-c-a-1 mil-sub-text-2">{counter_suffix}</span>}
              {counter_label && <h6 className="mil-mt-1 mil-mb-4">{counter_label}</h6>}
            </>
          )}
          {button_text && button_url && (
            <Link href={button_url} className="mil-btn mil-mr-4 mil-accent">
              <span>{button_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
          {side_image && (
            <div className="mil-side-image mil-angle mil-mt-5">
              <Media resource={side_image} imgClassName="mil-scale-img" />
            </div>
          )}
        </div>
      </div>

      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
          {right_title && (
            <h3 className="mil-mb-5" dangerouslySetInnerHTML={{ __html: sanitizeHTML(right_title) }} />
          )}

          {description && (
            <div className={`mil-t-16 mil-c-m-2 mil-mb-5`}>
                <RichText data={description} enableGutter={false} />
            </div>
          )}

          {features && features.length > 0 && hasFeatureImages && (
            <div className="mil-feature-grid mil-mb-5">
              {features.map((item, i) => (
                <div key={i} className="mil-feature-card">
                  {item.image && (
                    <div className="mil-feature-image">
                      <Media resource={item.image} />
                    </div>
                  )}
                  {item.title && <h6 className="mil-mb-2">{item.title}</h6>}
                  {item.description && <p className="mil-t-14 mil-c-m-2">{item.description}</p>}
                </div>
              ))}
            </div>
          )}

          {features && features.length > 0 && !hasFeatureImages && (
            <ul className="mil-check-list mil-type-2 mil-mb-5">
              {features.map((item, i) => (
                <li key={i}>
                  {item.title && <h6 className="mil-mb-2 mil-mt-2">{item.title}</h6>}
                  {item.description && (
                    <p className="mil-t-16 mil-c-m-2">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {process_title && <h5 className="mil-mb-5">{process_title}</h5>}
          {process_steps && process_steps.length > 0 && (
            <ul className="mil-timeline mil-mb-5">
              {process_steps.map((step, i) => (
                <li key={i}>
                  <div className="mil-head mil-mb-2">
                    {step.title && <h6>{step.title}</h6>}
                  </div>
                  {step.description && (
                    <p className="mil-t-16 mil-c-m-2">{step.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {deliverables_title && <h5 className="mil-mb-5">{deliverables_title}</h5>}
          {deliverables && deliverables.length > 0 && (
            <ul className="mil-check-list mil-type-2">
              {deliverables.map((item, i) => (
                <li key={i}>
                  {item.title && <h6 className="mil-mb-2 mil-mt-2">{item.title}</h6>}
                  {item.description && (
                    <p className="mil-t-16 mil-c-m-2">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}