import React from 'react'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import Link from "next/link";
import type { AboutUsFourBlock as AboutUsFourBlockProps } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const AboutUsFourBlock: React.FC<AboutUsFourBlockProps> = ({
  icon,
  title,
  description,
  users,
  button1_text,
  button1_url,
  button2_text,
  button2_url,
  image,
  counters,
  partners,
}) => {
  return (
    <div className="mil-section mil-p-10-8">
      <div className="container">
        <div className="row mil-jcb mil-aic">
          <div className="col-lg-5 mil-mb-10">
            {icon && (
              <div className="mil-icon mil-c-m-1 mil-mb-4">
                <Media resource={icon} />
              </div>
            )}
            {title && (
              <h2
                className="mil-c-m-1 mil-mb-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(title) }}
              />
            )}
            {description && (
              <div className="mil-t-16 mil-c-m-2 mil-mb-4">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
            {users && users.length > 0 && (
              <ul className="mil-users-row mil-mb-4">
                {users.map((user, index) => (
                  <li key={index}>
                    <Media resource={user.image} />
                  </li>
                ))}
              </ul>
            )}
            {button1_text && button1_url && (
              <Link href={button1_url} className="mil-btn mil-mr-4">
                <span>{button1_text}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
            {button2_text && button2_url && (
              <Link href={button2_url} className="mil-btn mil-dark mil-link-type">
                <span>{button2_text}</span>
                <i className="far fa-arrow-right"></i>
              </Link>
            )}
          </div>
          <div className="col-lg-5 mil-mb-10">
            {image && (
              <div className="mil-image-frame mil-port-ori mil-angle">
                <Media
                  resource={image}
                  imgClassName="mil-scale-img"
                />
                <div className="mil-overlay" style={{ opacity: 0.3 }}></div>
                <div className="mil-image-content">
                  {counters && counters.length > 0 && (
                    <>
                      {counters.map((counter, index) => (
                        <div key={index} className={`mil-counter-box ${index === 1 ? '' : 'mil-mb-1'}`}>
                          {counter.upper && (
                            <h6 className="mil-c-m-4">
                              <span className="mil-c-a-1">{counter.upper}</span>
                              <br />
                              {counter.lower}
                            </h6>
                          )}
                          {counter.value && (
                            <div className={`mil-c-${index === 1 ? 'a-1' : 'm-4'} mil-counter-1`}>
                              {counter.value}
                              {counter.suffix && (
                                <span className={`mil-c-${index === 1 ? 'm-4' : 'a-1'}` + counter.suffix_class || ` mil-sub-text-${index === 1 ? '1' : '2'}`}>
                                  {counter.suffix}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="mil-partners">
          <div className="row">
            {partners && partners.length > 0 && (
              <>
                {partners.slice(0, 3).map((partner, index) => (
                  <div key={index} className="col-6 col-md-4 col-lg mil-tac mil-mb-2">
                    <div className="mil-partner">
                      <Media resource={partner.image} />
                    </div>
                  </div>
                ))}
                {partners.slice(3, 5).map((partner, index) => {
                  const colIndex = index + 3
                  return (
                    <div key={colIndex} className={`col-6 col-md-6 col-lg mil-tac mil-mb-2`}>
                      <div className="mil-partner">
                        <Media resource={partner.image} />
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}