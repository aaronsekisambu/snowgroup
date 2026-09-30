import React from 'react'
import Link from "next/link"
import type { PricesBlock as PricesBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const PricesBlock: React.FC<PricesBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  plans,
  compact,
}) => {
  return (
    <div className="mil-section mil-p-10-8">
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
          {plans?.map((plan, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className={`mil-card mil-angle ${plan.card_style || 'mil-angle-gray'} mil-w-100 mil-md-tal mil-mb-2`}>
                {plan.tier && <div className="mil-badge mil-mb-3">{plan.tier}</div>}
                {plan.name && <h6 className="mil-mb-2 mil-c-m-1">{plan.name}</h6>}
                {plan.tagline && <h4 className="mil-mb-2 mil-c-m-1">{plan.tagline}</h4>}
                {plan.price && (
                  <div className="mil-flex-row mil-aie mil-mb-2">
                    <div className="mil-counter-1">
                      <span className="mil-sub-text-1">$</span> {plan.price}
                    </div>
                    {plan.price_suffix && (
                      <p className="mil-mb-1 mil-ml-1 mil-c-m-2">{plan.price_suffix}</p>
                    )}
                  </div>
                )}
                {plan.description && (
                  <p
                    className="mil-t-16 mil-c-m-2 mil-mb-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(plan.description) }}
                  />
                )}
                {!compact && plan.features && plan.features.length > 0 && (
                  <>
                    <div className="mil-divider mil-w-100 mil-mb-3"></div>
                    <ul className="mil-check-list mil-mb-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className={feature.disabled ? "mil-empty" : ""}>
                          {feature.item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mil-divider mil-w-100 mil-mb-3"></div>
                {plan.button_text && plan.button_disabled && (
                  <span className="mil-btn mil-disabled" aria-disabled="true">
                    <span>{plan.button_text}</span>
                    <i className="far fa-clock"></i>
                  </span>
                )}
                {plan.button_text && !plan.button_disabled && plan.button_url && (
                  <Link href={plan.button_url} className={`mil-btn ${plan.button_style || 'mil-soft'}`}>
                    <span>{plan.button_text}</span>
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