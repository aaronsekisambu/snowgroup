'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, imgClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onSuspend = () => {
      // setShowFallback(true);
      // console.warn('Video was suspended, rendering fallback image.')
    }

    video.addEventListener('suspend', onSuspend)

    // cleanup in case ref changes or component unmounts
    return () => {
      video.removeEventListener('suspend', onSuspend)
    }
  }, [videoRef])

  if (resource && typeof resource === 'object') {
    const { url } = resource

    let dataValue1: string | undefined
    let dataValue2: string | undefined
    let customCss: React.CSSProperties | undefined

    if ( videoClassName?.includes('mil-scale-img-top') || imgClassName?.includes('mil-scale-img-top') ) {
      dataValue1 = '1';
      dataValue2 = '1.3';

      if ( videoClassName?.includes('mil-scale-img-1-1_1') || imgClassName?.includes('mil-scale-img-top') ) {
        dataValue1 = '1';
        dataValue2 = '1.1';
      }

      customCss = {
        "objectPosition": "center"
      }
    }

    return (
      <video
        autoPlay
        className={cn(videoClassName ? videoClassName : imgClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
        data-value-1={dataValue1} 
        data-value-2={dataValue2}
        style={customCss}
      >
        <source src={getMediaUrl(url)} />
      </video>
    )
  }

  return null
}
