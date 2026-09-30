import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from "next/link";
import type { AboutUsThreeBlock as AboutUsThreeBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const AboutUsThreeBlock: React.FC<AboutUsThreeBlockProps> = ({
  badge,
  title,
  left_description,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  right_description1,
  image,
  right_description2,
  skills,
  right_description3,
}) => {
  return (
    <div className="mil-sticky-section">
      <div className="mil-sticky-part mil-p-10-10">
        <div className="mil-fake-container-left">
          {badge && <div className="mil-badge mil-mb-4">{badge}</div>}
          {title && (
            <h2
              className="mil-mb-4"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
            />
          )}
          <div className="mil-w-80">
            {left_description && (
              <p
                className="mil-t-16 mil-c-m-2 mil-mb-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(left_description) }}
              />
            )}
          </div>
          {button1_text && button1_url && (
            <Link href={button1_url} className="mil-btn mil-mr-4 mil-accent">
              <span>{button1_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
          {button2_text && button2_url && (
            <Link href={button2_url} className="mil-btn mil-link-type mil-dark">
              <span>{button2_text}</span>
              <i className="far fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
      <div className="mil-scroll-part mil-p-0-10">
        <div className="mil-fake-container-right mil-no-pad mil-mt-10 mil-mb-0">
          {right_description1 && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-5">
              <RichText data={right_description1} enableGutter={false} />
            </div>
          )}

          {image && (
            <div className="mil-image-frame mil-angle mil-mb-5">
              <Media
                resource={image}
                imgClassName="mil-scale-img"
                data-value-1="1.1"
                data-value-2="1"
              />
              <div className="mil-overlay" style={{ opacity: 0.2 }}></div>
            </div>
          )}

          {right_description2 && (
            <div className="mil-t-16 mil-c-m-2 mil-mb-5">
              <RichText data={right_description2} enableGutter={false} />
            </div>
          )}

          {skills && skills.length > 0 && (
            <>
              {skills.map((skill, index) => (
                <div key={index} className="mil-skill-frame mil-mb-3">
                  <div className="mil-flex-row mil-jcb mil-mb-2">
                    {skill.name && <h6>{skill.name}</h6>}
                    {skill.percentage && <p className="mil-c-m-2">{skill.percentage}</p>}
                  </div>
                  <div className="mil-skill">
                    {skill.percentage && <div className="mil-skill-prog" data-value={skill.percentage}></div>}
                  </div>
                </div>
              ))}
            </>
          )}

          {right_description3 && (
            <div className="mil-t-16 mil-c-m-2">
              <RichText data={right_description3} enableGutter={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}