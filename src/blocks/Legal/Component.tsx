import React from 'react'
import Link from "next/link"
import RichText from '@/components/RichText'
import type { LegalBlock as LegalBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

// Text pages (legal information, policies, sitemap): heading on the left, sections on the right
export const LegalBlock: React.FC<LegalBlockProps> = ({
  badge,
  title,
  updated,
  intro,
  button_text,
  button_url,
  sections,
  link_groups,
}) => {
  return (
    <div className="mil-sticky-section mil-bg-out-left-gray mil-md-white">
      <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && <h2 className="mil-mb-4" dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }} />}
          {updated && <p className="mil-t-14 mil-c-m-2 mil-mb-4">Last updated: {updated}</p>}
          {intro && <p className="mil-t-16 mil-c-m-2 mil-mb-4 mil-w-80">{intro}</p>}
          {button_text && button_url && (
            <Link href={button_url} className="mil-btn">
              <span>{button_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-pad-10 mil-mt-10 mil-mb-0">
          {sections?.map((section: { heading?: string; body?: string }, i: number) => (
            <div key={i} className="mil-legal-section">
              {section.heading && <h5 className="mil-mb-3">{section.heading}</h5>}
              {section.body && (
                <div className="mil-t-16 mil-c-m-2">
                  <RichText data={section.body} enableGutter={false} />
                </div>
              )}
            </div>
          ))}
          {link_groups && link_groups.length > 0 && (
            <div className="mil-sitemap">
              {link_groups.map((group: { title: string; links: { label: string; url: string }[] }, i: number) => (
                <div key={i} className="mil-sitemap-group">
                  <h6 className="mil-mb-3">{group.title}</h6>
                  <ul>
                    {group.links.map((link, j) => (
                      <li key={j}>
                        <Link href={link.url}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
