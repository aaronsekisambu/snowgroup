import React from 'react'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { CountersBlock as CountersBlockProps } from '@/types/content'

export const CountersBlock: React.FC<CountersBlockProps> = ({
  counters,
  description,
  image,
}) => {
  return (
    <div className="row mil-aic g-0">
      <div className="col-lg-6 mil-p-10-10">
        <div className="mil-fake-container-left">
          <div className="row mil-mb-4">
            {counters?.map((counter, index) => (
              <div key={index} className="col-6">
                <div>
                  <span className="mil-counter mil-counter-1" data-number={counter.value}>
                    {counter.value}
                  </span>
                  {counter.suffix && (
                    <span className={"mil-c-a-1 " + (counter.suffix_class || "mil-sub-text-2")}>
                      {counter.suffix}
                    </span>
                  )}
                </div>
                {counter.title && <h6 className="mil-mt-1">{counter.title}</h6>}
              </div>
            ))}
          </div>
          <div className="mil-divider mil-mb-4"></div>
          {description && (
            <p
              className="mil-t-16 mil-c-m-2"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
            />
          )}
        </div>
      </div>
      <div className="col-lg-6">
        {image && (
          <div className="mil-square-box mil-short mil-angle mil-angle-lg">
            <Media
              resource={image}
              imgClassName="mil-scale-img"
            />
            <div className="mil-overlay" style={{ opacity: 0.2 }}></div>
          </div>
        )}
      </div>
    </div>
  )
}