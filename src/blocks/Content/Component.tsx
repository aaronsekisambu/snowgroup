import React from 'react'
import RichText from '@/components/RichText'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { ContentBlock as ContentBlockProps } from '@/types/content'

export const ContentBlock: React.FC<ContentBlockProps> = ({ title, columns, dividerTop, dividerBottom, padding_top, padding_bottom }) => {
  return (
    <>
      {dividerTop === true &&
      <div className="container">
        <div className="mil-divider"></div>
      </div>
      }

      <div className={`mil-p-${padding_top}-${padding_bottom}`}>
          <div className="container">
              <div className="row mil-jcb gx-5">
                  {title &&
                  <div className="col-lg-12">
                      <h2 className="mil-h2 mil-c-m-1 mil-mb-5" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />
                  </div>
                  }
                  {columns?.map((item, index) => (
                  <div key={`content-col-${index}`} className={item.size == 'half' ? "col-lg-6" : "col-lg-12"}>
                      {item.richText && <div className="mil-text-md mil-mb30 mil-up"><RichText data={item.richText} enableGutter={false} /></div>}
                  </div>
                  ))}
              </div>
          </div>
      </div>

      {dividerBottom === true &&
      <div className="container">
        <div className="mil-divider"></div>
      </div>
      }
    </>
  )
}
