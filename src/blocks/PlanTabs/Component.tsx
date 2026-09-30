'use client'

import React, { useState } from 'react'
import Link from "next/link"
import type { PlanTabsBlock as PlanTabsBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Item = { title?: string; description?: string }
type PlanDetail = {
  label: string
  tier?: string
  tagline?: string
  summary?: string
  status?: string
  button_text?: string
  button_url?: string
  benefits?: Item[]
  features?: Item[]
  steps?: Item[]
}

// One plan at a time: pick a plan, see what it is, what's included and how it works
export const PlanTabsBlock: React.FC<PlanTabsBlockProps> = ({ badge, title, description, plans }) => {
  const [active, setActive] = useState(0)
  const plan: PlanDetail | undefined = plans?.[active]

  return (
    <div className="mil-section mil-gray-section mil-p-10-8" id="plan-details">
      <div className="container">
        <div className="row mil-aie mil-mb-5">
          <div className="col-12 col-md-6 mil-sm-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
            {title && <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
          </div>
          <div className="col-12 col-md-6">
            {description && <p className="mil-c-m-2 mil-t-14">{description}</p>}
          </div>
        </div>

        <div className="mil-filter mil-mb-5" role="tablist" aria-label="Plans">
          {plans?.map((item: PlanDetail, i: number) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={i === active ? 'mil-active' : ''}
              onClick={() => setActive(i)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {plan && (
          <div className="row" role="tabpanel">
            <div className="col-lg-5 mil-mb-2">
              <div className="mil-plan-focus">
                {plan.tier && <div className="mil-plan-tier mil-mb-3">{plan.tier}</div>}
                <h3 className="mil-mb-2">{plan.label}</h3>
                {plan.tagline && <h5 className="mil-plan-tagline mil-mb-3">{plan.tagline}</h5>}
                {plan.summary && <p className="mil-t-16 mil-mb-4">{plan.summary}</p>}
                {plan.benefits && plan.benefits.length > 0 && (
                  <ul className="mil-plan-benefits mil-mb-4">
                    {plan.benefits.map((item, i) => (
                      <li key={i}>
                        <strong>{item.title}</strong> {item.description}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mil-plan-actions">
                  {plan.status && (
                    <span className="mil-btn mil-disabled" aria-disabled="true">
                      <span>{plan.status}</span>
                      <i className="far fa-clock"></i>
                    </span>
                  )}
                  {plan.button_text && plan.button_url && (
                    <Link href={plan.button_url} className="mil-btn mil-link-type">
                      <span>{plan.button_text}</span>
                      <i className="far fa-arrow-right"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-7 mil-mb-2">
              <div className="mil-plan-included">
                <h5 className="mil-mb-4">What&apos;s included</h5>
                <ul className="mil-plan-features">
                  {plan.features?.map((item, i) => (
                    <li key={i}>
                      <h6 className="mil-mb-1">{item.title}</h6>
                      <p className="mil-t-14 mil-c-m-2">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {plan.steps && plan.steps.length > 0 && (
              <div className="col-12">
                <div className="mil-plan-steps">
                  <h5 className="mil-mb-4">How it works</h5>
                  <ol>
                    {plan.steps.map((step, i) => (
                      <li key={i}>
                        <span className="mil-plan-step-num">{String(i + 1).padStart(2, '0')}</span>
                        <h6 className="mil-mb-1">{step.title}</h6>
                        <p className="mil-t-14 mil-c-m-2">{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
