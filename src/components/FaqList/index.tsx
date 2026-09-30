'use client';

import React, { useState } from 'react'
import RichText from '@/components/RichText'
import type { FaqBlock as FaqBlockProps } from '@/types/content'

export type Props = {
  faqs: FaqBlockProps['faqs']
}

export const FaqList: React.FC<Props> = (props) => {
  const { faqs } = props
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleFaqClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="mil-faq">
        <ul className="mil-faq-list">
            {faqs?.map((faq, index) => (
            <li key={index} className={`mil-faq-item ${activeIndex === index ? 'mil-active' : ''}`}>
                <button 
                className="mil-faq-question"
                onClick={() => handleFaqClick(index)}
                >
                {faq.question}
                <span className="mil-faq-icon">
                    <i className="far fa-arrow-right"></i>
                </span>
                </button>
                {faq.answer && (
                <div className="mil-faq-answer">
                    <div className="mil-t-16 mil-c-m-2">
                    <RichText data={faq.answer} enableGutter={false} />
                    </div>
                </div>
                )}
            </li>
            ))}
        </ul>
    </div>
  )
}