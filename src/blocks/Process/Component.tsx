import React from 'react'
import Link from "next/link"
import type { ProcessBlock as ProcessBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const ProcessBlock: React.FC<ProcessBlockProps> = ({
  badge,
  title,
  description,
  button_text,
  button_url,
  steps,
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
        {steps && steps.length > 0 && (
          <ol className="mil-process">
            {steps.map((step, index) => (
              <li key={index} className="mil-process-step">
                <div className="mil-process-head">
                  <div className="mil-process-icon">
                    {step.icon && <i className={step.icon}></i>}
                  </div>
                  <span className="mil-process-line"></span>
                </div>
                <div className="mil-process-body">
                  {step.number && <span className="mil-process-num">{step.number}</span>}
                  {step.title && <h4 className="mil-mb-2 mil-c-m-1">{step.title}</h4>}
                  {step.subtitle && <h6 className="mil-mb-3 mil-c-m-1">{step.subtitle}</h6>}
                  {step.description && (
                    <p
                      className="mil-t-16 mil-c-m-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(step.description) }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
