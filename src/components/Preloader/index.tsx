'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PreloaderAnimation } from '@/common/scrollAnimation'

export const Preloader = () => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const cleanup = PreloaderAnimation();

    const t = setTimeout(() => {
      setShow(false);
    }, 6000)

    return () => {
      cleanup?.();
      clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="mil-preloader-frame">
          <div></div>
          <div className="mil-logo">
              <Image src="/media/snow-logo-white.png" alt="Snow Holdings Limited" width={108} height={99} />
          </div>
          <div className="mil-preloader mil-tac">
              <div>
                  <p className="mil-c-m-3 mil-mb-1 mil-t-16">Loading ...</p>
                  <div className="mil-mb-2"><span className="mil-counter mil-counter-2 mil-c-m-4">00</span><span className="mil-c-a-1 mil-sub-text-1">%</span></div>
                  <div className="mil-mil-preloader-line-frame">
                      <div className="mil-mil-preloader-line"></div>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}