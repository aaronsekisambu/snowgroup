'use client'

import React, { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'

import { SliderProps } from "../../common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import type { HeroFiveBlock } from '@/types/content'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type HeroFiveSlide = NonNullable<HeroFiveBlock['slides']>[number];

export const HeroCarouselTwoSwiper: React.FC<{ items: HeroFiveBlock['slides']; onSwiper?: (swiper: SwiperType) => void; }> = ({ items, onSwiper }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (            
    <Swiper
        {...SliderProps.milHeroSliderTwo}
        className="swiper-container mil-slider-title mil-mb-4"
        onSwiper={(swiper: SwiperType) => {
          swiperRef.current = swiper;
          onSwiper?.(swiper);
        }}
    >
            {items?.map((item: HeroFiveSlide, key: number) => {
            // a page gets one h1: the first slide; the rest are h2s styled the same
            const Heading = key === 0 ? 'h1' : 'h2'
            return (
            <SwiperSlide className="swiper-slide" key={`hero-titles-carousel-swiper-item-${key}`}>
                {item.title && (
                <div data-swiper-parallax="-50%" data-swiper-parallax-opacity="0" data-swiper-parallax-scale="0.4">
                    <Heading className="mil-h1 mil-hero-title mil-fs-xxxl mil-c-m-4 mil-tac" dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.title) }} />
                </div>
                )}
            </SwiperSlide>
            )})}
    </Swiper>
  )
}