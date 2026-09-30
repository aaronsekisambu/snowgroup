import React from 'react'
import RichText from '@/components/RichText'
import { FormBuilder } from '@/components/FormBuilder'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { FormBlock as FormBlockProps } from '@/types/content'
import type { Form as FormType } from '@/types/content'

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const {
    badge,
    title,
    contact_items,
    social_links,
    desc_title,
    desc_content,
    form_title,
    form,
    gmap_title,
    gmap,
  } = props

  return (
      <div className="mil-sticky-section mil-bg-out-left-gray mil-md-white">
        <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
            <div className="mil-fake-container-left">
                {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
                {title && <h2 className="mil-mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
                {contact_items && contact_items.length > 0 && (
                <ul className="mil-half-list mil-mb-5">
                    {contact_items.map((item, index) => (
                      <li key={index} className="mil-mb-3">
                        <p className="mil-c-m-2">{item.label}:</p>
                        <div className="mil-dots"></div>
                        <p>{item.link ? <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{item.value}</a> : item.value}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {social_links && social_links.length > 0 && (
                  <ul className="mil-social mil-c-m-1">
                    {social_links.map((link, index) => (
                      <li key={index}>
                        <a href={link.url ? link.url : ''} target={link.url?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                          <i className={link.icon_class ? link.icon_class : ''}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
        </div>
        <div className="mil-scroll-part mil-p-0-10">
            <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
                {desc_content && (
                <>
                  {desc_title && <h3 className="mil-mb-5" dangerouslySetInnerHTML={{ __html:  sanitizeHTML(desc_title) }} />}
                  <div className="mil-t-16 mil-c-m-2 mil-mb-5">
                      <RichText data={desc_content} enableGutter={false} />
                  </div>
                </>
                )}

                {gmap &&
                <>
                  {gmap_title && <h6 className="mil-mb-5" dangerouslySetInnerHTML={{ __html:  sanitizeHTML(gmap_title) }} />}
                  <div className="mil-map mil-mb-5">
                      <iframe 
                        src={gmap}  
                        style={{"border":"0"}} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade" 
                      />
                  </div>
                </>
                }

                {form_title && <h6 className="mil-mb-5" dangerouslySetInnerHTML={{ __html:  sanitizeHTML(form_title) }} />}
                {form && <FormBuilder form={form as FormType} />}
            </div>
        </div>
        
    </div>
  )
}
