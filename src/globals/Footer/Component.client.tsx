'use client'

import Link from 'next/link'
import type { Footer as FooterType } from '@/types/content'
import { usePageContext } from '@/providers/PageProvider'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

interface FooterProps {
  data: FooterType | null | undefined
}

export const FooterClient: React.FC<FooterProps> = ({ data }) => {
  const { footerLayout } = usePageContext()

  if (!data) return null

  const {
    logo,
    mainMenu = [],
    policyLinks = [],
    social = [],
    footerLinks = [],
    locations = [],
    copyright,
    createdBy,
  } = data

  const backgroundImage = (data as FooterType)?.backgroundImage
  const logoLight = (data as FooterType)?.logoLight
  const logoText = (data as FooterType)?.logo_text
  const footerCta = (data as FooterType)?.cta

  const layoutType = footerLayout || (data as FooterType)?.layoutType || 'default'

  if (layoutType === 'minimal') {
    return (
      <footer className="mil-footer-1">
        {backgroundImage && (
          <Media
            imgClassName="mil-bg-img mil-scale-img"
            resource={backgroundImage}
          />
        )}
        <div className="mil-overlay"></div>
        <div className="container">
          <div className="mil-footer-content mil-p-10-10">
            <div className="row">
              <div className="col-md-6 mil-flex-column mil-sm-aic">
                {typeof logoLight === 'object' && logoLight ? (
                  <Link href="/" className="mil-logo mil-footer-logo mil-mb-4 mil-sm-mb-5">
                    <Media
                      resource={logoLight}
                    />
                    {logoText && <span>{logoText}</span>}
                  </Link>
                ) : typeof logo === 'object' && logo ? (
                  <Link href="/" className="mil-logo mil-mb-4 mil-sm-mb-5">
                    <Media
                      resource={logo}
                    />
                  </Link>
                ) : null}
                {mainMenu && mainMenu.length > 0 && (
                  <ul className="mil-footer-menu-1 mil-sm-mb-4">
                    {mainMenu.map((item, idx) => (
                      <li key={idx} className={idx === 0 ? 'mil-current' : ''}>
                        <Link href={item.link || '#'}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-md-6 mil-flex-column mil-aie mil-sm-aic">
                {social && social.length > 0 && (
                  <ul className="mil-social mil-c-m-4 mil-mb-4">
                    {social.map((item, idx) => (
                      <li key={idx}>
                        <a href={item.link || '#'} target={item.link?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"><i className={item.icon || ''}></i></a>
                      </li>
                    ))}
                  </ul>
                )}
                {policyLinks && policyLinks.length > 0 && (
                  <ul className="mil-footer-links mil-c-m-4 mil-aie mil-sm-aic">
                    {policyLinks.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.link || '#'}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mil-footer-bottom">
          <div className="container mil-flex-row mil-sm-flex-column mil-jcb mil-sm-aic">
            <p className="mil-c-m-3 mil-sm-mb-2">{copyright}</p>
            <p className="mil-c-m-3">{createdBy && <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(createdBy) }} />}</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mil-footer-2">
      <div className="container">
        <div className="mil-footer-content mil-p-10-10">
          <div className="row mil-jcb">
            <div className="col-md-5 col-lg-7 mil-flex-column mil-sm-mb-5">
              <div className="row">
                <div className="col-lg-7 mil-flex-column mil-sm-aic">
                  {logo && typeof logo === 'object' && logo.url && (
                    <Link href="/" className="mil-logo mil-footer-logo mil-mb-4">
                      <Media
                        resource={logo}
                      />
                      {logoText && <span>{logoText}</span>}
                    </Link>
                  )}
                  {footerCta?.text && (
                    <p className="mil-t-16 mil-c-m-2 mil-mb-4">{footerCta.text}</p>
                  )}
                  {footerCta?.button_text && footerCta?.button_url && (
                    <Link href={footerCta.button_url} className="mil-btn">
                      <span>{footerCta.button_text}</span>
                      <i className="far fa-arrow-right"></i>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-2 mil-sm-mb-5">
              {/* {mainMenu && mainMenu.length > 0 && (
                <ul className="mil-footer-menu-2 mil-flex-column mil-sm-aic">
                  {mainMenu.map((item, idx) => (
                    <li key={idx} className={idx === 0 ? 'mil-current' : ''}>
                      <Link href={item.link || '#'}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )} */}
            </div>
            <div className="col-md-2">
              {policyLinks && policyLinks.length > 0 && (
                <ul className="mil-footer-links mil-hover-dark mil-flex-column mil-c-m-2 mil-ais mil-sm-aic">
                  {policyLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link href={item.link || '#'}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mil-footer-adress mil-gray-section mil-p-10-5 mil-angle mil-angle-lg">
        <div className="container">
          <div className="row mil-jcb">
            <div className="col-md-5 col-lg-7 mil-flex-column mil-jcb mil-sm-aic">
              {social && social.length > 0 && (
                <ul className="mil-social mil-c-m-1 mil-mb-5">
                  {social.map((item, idx) => (
                    <li key={idx}>
                      <a href={item.link || '#'} target={item.link?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                        <i className={item.icon || ''}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {footerLinks && footerLinks.length > 0 && (
                <ul className="mil-footer-links mil-hover-dark mil-c-m-2 mil-mb-5 mil-ais mil-sm-aic">
                  {footerLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link href={item.link || '#'}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {locations && locations.map((location, idx) => (
              <div key={idx} className="col-md-2">
                <div className="mil-w-80 mil-mb-5 mil-sm-tac">
                  <h6 className="mil-mb-2">{location.title}</h6>
                  <p className="mil-t-14 mil-c-m-2 mil-mb-2">{location.address}</p>
                  {location.phone && (
                    <p className="mil-h6 mil-mb-2">
                      <a href={location.phone_link || `tel:${location.phone}`} target={location.phone_link ? "_blank" : undefined} rel="noopener noreferrer">{location.phone}</a>
                    </p>
                  )}
                  {location.email && (
                    <p className="mil-t-14 mil-c-m-2">
                      <a href={`mailto:${location.email}`}>{location.email}</a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mil-footer-bottom">
        <div className="container mil-flex-row mil-sm-flex-column mil-jcb mil-sm-aic">
          <p className="mil-c-m-2 mil-sm-mb-2">{copyright}</p>
          <p className="mil-c-m-2">{createdBy && <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(createdBy) }} />}</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterClient
