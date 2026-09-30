import React from 'react'
import { Media } from '@/components/Media'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

import type { SubscribeBlock as SubscribeBlockProps } from '@/types/content'

export const SubscribeBlock: React.FC<SubscribeBlockProps> = ({ title, media_file }) => {
  return (
    <div className="mil-section mil-p-10-10">
        {media_file && (
        <Media
            imgClassName={"mil-bg-img mil-scale-img"}
            resource={media_file}
        />
        )}
        <div className="mil-overlay mil-blur"></div>
        <div className="container">
            <div className="row mil-aic">
                <div className="col-md-8">
                    {title && <h2 className="mil-c-m-5 mil-sm-tac" dangerouslySetInnerHTML={{ __html:  sanitizeHTML(title) }} />}
                </div>
                <div className="col-md-4 mil-flex-row mil-jce mil-sm-jcc mil-sm-mt-5">
                    <form className="mil-subscribe" action={ process.env.NEXT_PUBLIC_MAILCHIMP_ACTION_URL }>
                        <input type="hidden" name={ process.env.NEXT_PUBLIC_MAILCHIMP_PUBLIC_KEY } />
                        <input type="email" name="EMAIL" placeholder="Email" required />
                        <button type="submit">
                            <i className="fal fa-envelope"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
