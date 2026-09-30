'use client'

import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

import type { AboutTeamBlock as AboutTeamBlockProps } from '@/types/content'

export const AboutTeamBlock: React.FC<AboutTeamBlockProps> = ({
  portrait,
  name,
  position,
  contact_items,
  social_links,
  intro_description,
  quote,
  bio_description,
  skills,
  timeline,
  certificate_image,
  closing_description,
}) => {
  return (
    <div className="mil-sticky-section mil-bg-out-left-gray">
      <div className="mil-sticky-part mil-p-10-10 mil-angle mil-angle-lg">
        <div className="mil-fake-container-left">
          {portrait && (
            <div className="mil-circle-portrait mil-mb-2">
              <Media resource={portrait} imgClassName="mil-w-100" />
            </div>
          )}
          {name && <h3 className="mil-mb-2">{name}</h3>}
          {position && <p className="mil-c-m-2 mil-mb-5">{position}</p>}

          {contact_items && contact_items.length > 0 && (
            <ul className="mil-half-list mil-mb-5">
              {contact_items.map((item, i) => (
                <li key={i} className="mil-mb-3">
                  <p className="mil-c-m-2">{item.label}:</p>
                  <div className="mil-dots"></div>
                  <p>{item.value}</p>
                </li>
              ))}
            </ul>
          )}

          {social_links && social_links.length > 0 && (
            <ul className="mil-social mil-c-m-1">
              {social_links.map((link, i) => (
                <li key={i}>
                  <a href={link.url ? link.url : '' } target="_blank">
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
          {intro_description && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-5">
              <RichText data={intro_description} enableGutter={false} />
            </div>
          )}

          {quote && <blockquote className="mil-handwrite mil-mb-5">{quote}</blockquote>}

          {bio_description && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-5">
              <RichText data={bio_description} enableGutter={false} />
            </div>
          )}

          {skills && skills.length > 0 && (
            <>
              {skills.map((skill, i) => (
                <div key={i} className="mil-skill-frame mil-mb-3">
                  <div className="mil-flex-row mil-jcb mil-mb-2">
                    <h6>{skill.name}</h6>
                    <p className="mil-c-m-2">{skill.percentage}</p>
                  </div>
                  <div className="mil-skill">
                    <div className="mil-skill-prog" data-value={skill.percentage}></div>
                  </div>
                </div>
              ))}
              <div className="mil-mb-5"></div>
            </>
          )}

          {timeline && timeline.length > 0 && (
            <ul className="mil-timeline mil-mb-5">
              {timeline.map((item, i) => (
                <li key={i}>
                  <div className="mil-head mil-mb-2">
                    {item.date && <div className="mil-badge mil-mb-2">{item.date}</div>}
                    {item.title && <h6>{item.title}</h6>}
                  </div>
                  {item.description && (
                    <p className="mil-t-16 mil-c-m-2">{item.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {certificate_image && (
            <Media
              resource={certificate_image}
              imgClassName="mil-w-100 mil-mb-5"
            />
          )}
          
          {closing_description && (
            <div className="mil-t-16 mil-c-m-2">
              <RichText data={closing_description} enableGutter={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}