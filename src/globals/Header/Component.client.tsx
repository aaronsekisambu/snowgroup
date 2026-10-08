"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/types/content'
import { usePageContext } from '@/providers/PageProvider'

import { HeaderNav } from './Nav'
import { FormBuilder } from '@/components/FormBuilder'
import type { Form as FormType } from '@/types/content'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const asPath = usePathname()
  const [open, setOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const { headerStyle: pageHeaderStyle } = usePageContext()

  // Determine which header style to use: page override (if set) > global setting > default
  const headerStyle = pageHeaderStyle ? pageHeaderStyle : (data?.headerStyle || 'default')
  const isInvert = headerStyle === 'invert'

  useEffect(() => {
    // close mobile menu on route change
    setOpen(false)
  }, [asPath])

  const logo = data?.logo
  const contact = data?.contact
  const ordercall = data?.ordercall

  const renderLogo = () => {
    if (!logo) return null
    const href = logo.link ? logo.link : '/'

    if (logo.type === 'image' && typeof logo.logo === 'object') {
      const logo_stable = ( isInvert ) ? (typeof data.logo?.logo_invert === 'object' ? data.logo?.logo_invert : '') : logo.logo
      
      return (
        <Link href={href} className="mil-logo" data-no-swup>
          {logo_stable && (
            <Media
              resource={logo_stable}
            />
          )}
          {/* shown once the header gets its solid background */}
          {logo.scroll_text && <span className="mil-logo-scroll-text">{logo.scroll_text}</span>}
        </Link>
      )
    }

    return (
      <Link href={href} className="mil-logo" data-no-swup>
        {logo.fontawesome_icon && <i className={logo.fontawesome_icon}></i>}
        {logo.text && <span>{logo.text}</span>}
      </Link>
    )
  }

  return (
    <>
    <div className={`mil-top-panel ${isInvert ? 'mil-invert mil-static' : ''} ${infoOpen ? 'mil-active' : ''}`}>
      <div className="mil-container mil-flex-row mil-aic mil-jcb">
        {renderLogo()}

        <div className={`mil-mobile-menu ${open ? 'mil-active' : ''}`}>
          <nav aria-label="Main">
            <HeaderNav data={data} />
          </nav>

          <a
            href={contact?.link || '#'}
            className={`mil-btn mil-open-info ${infoOpen ? 'mil-active' : ''}`}
            data-no-swup
            onClick={(e) => {
              if (contact?.actionType === 'popup') {
                e.preventDefault()
                setInfoOpen((s) => !s)
              }
            }}
          >
            <span>{contact?.label || "Let's Talk"}</span>
            <i className={contact?.fontawesome_icon || 'fal fa-envelope'}></i>
            <i className="fal fa-times"></i>
          </a>
        </div>

        <div className={`mil-open-mobile-menu`}>
          <div className={`mil-menu-btn ${open ? 'mil-active' : ''}`} onClick={() => setOpen(!open)}><span /></div>
        </div>
      </div>
    </div>

    {contact &&
    <div className={`mil-info-window-frame mil-invert ${infoOpen ? 'mil-active' : ''}`}>
      <div className="mil-info-window">
        <h6 className="mil-mb-5">{contact?.popupTitle || 'Contact info'}</h6>
        <ul className="mil-half-list mil-mb-5">
          {contact?.popupItems && contact.popupItems.length > 0 && (
            contact.popupItems.map((item, i) => (
              <li className="mil-mb-3" key={`popup-item-${i}`}>
                <p className="mil-c-m-2">{item.label}</p>
                <div className="mil-dots"></div>
                <p>{item.link ? <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{item.value}</a> : item.value}</p>
              </li>
            ))
          )}
        </ul>
        {contact.formTitle && <h6 className="mil-mb-5">{contact.formTitle}</h6>}
        {contact.form &&
        <FormBuilder form={contact.form as FormType} />
        }
      </div>
    </div>
    }

    {ordercall &&
    <>
    <div className="mil-right-buttons-frame">
        <div className="mil-right-buttons">
            <a href="#top" className="mil-side-btn mil-back-to-top">
                <i className="far fa-arrow-up"></i>
            </a>
            <button className="mil-side-btn mil-open-window"></button>
        </div>
    </div>
    <div className="mil-order-call-frame">
        <div className="mil-order-call-window">
            <div className="mil-ocw-content">
                <div className="row g-0 mil-aic">
                    <div className="col-lg-7">
                      <div className="mil-form">
                          <h4 className="mil-mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(ordercall.formTitle ? ordercall.formTitle : '') }} />
                          {ordercall.form &&
                          <FormBuilder form={ordercall.form as FormType} submitButtonAlign={'left'} />
                          }
                      </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="mil-popup-banner">
                            {ordercall.bgImage && (
                              <Media
                                imgClassName="mil-ocw-img"
                                resource={ordercall.bgImage}
                              />
                            )}
                            <button className="mil-close-popup"><i className="fal fa-times"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    }
    </>
  )
}
