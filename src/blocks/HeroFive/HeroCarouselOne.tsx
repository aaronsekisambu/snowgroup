'use client'

import React, { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Media } from '@/components/Media'

import { SliderProps } from "../../common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import type { HeroFiveBlock } from '@/types/content'

type HeroFiveSlide = NonNullable<HeroFiveBlock['slides']>[number];

export const HeroCarouselOneSwiper: React.FC<{ items: HeroFiveBlock['slides']; onSwiper?: (swiper: SwiperType) => void; }> = ({ items, onSwiper }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (            
    <Swiper
        {...SliderProps.milHeroSliderOne}
        className="swiper-container mil-slider-bg-img mil-scale-img-top"
        data-value-1="1" 
        data-value-2="1.4"
        onSwiper={(swiper: SwiperType) => {
          swiperRef.current = swiper;
          onSwiper?.(swiper);  // Share with parent
        }}
    >
            {items?.map((item: HeroFiveSlide, key: number) => (
            <SwiperSlide className="swiper-slide" key={`hero-images-carousel-swiper-item-${key}`}>
                {item.bgImage && (
                <div className="mil-hero-bg" data-swiper-parallax-scale="1.4">
                    <Media
                        resource={item.bgImage}
                    />
                </div>
                )}
            </SwiperSlide>
            ))}
    </Swiper>
  )
}