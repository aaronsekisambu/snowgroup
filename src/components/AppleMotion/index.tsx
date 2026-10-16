'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// What fades up into place as it scrolls into view: section columns, cards and tiles.
// Heroes and sliders are left alone; they have their own motion.
const TARGETS = [
  '.mil-section .row > [class*="col-"]',
  '.mil-section .mil-process-step',
  '.mil-section .mil-feature-card',
  '.mil-price-card',
  '.snow-service-card',
  '.snow-tile',
  '.snow-highlight',
  '.snow-compare-card',
].join(', ')

const SKIP = '.swiper, .swiper-container, .mil-hero-5, .mil-top-panel, footer'

// Apple-style scroll reveal: content rises a little and fades in once, with cards in a row arriving one after another
export const AppleMotion: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>(TARGETS)).filter(
      (el) => !el.closest(SKIP) && !el.parentElement?.closest('.apple-reveal'),
    )

    elements.forEach((el) => {
      // cascade siblings in the same row, capped so long rows don't drag
      const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0
      el.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 80}ms`)
      el.classList.add('apple-reveal')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('is-visible')
          observer.unobserve(el)
          // once it has arrived, hand the element back to its own hover and press transitions
          el.addEventListener(
            'transitionend',
            (event) => {
              if (event.target === el && event.propertyName === 'transform') el.classList.remove('apple-reveal', 'is-visible')
            },
            { once: false },
          )
        })
      },
      // reveal as soon as the top edge is on screen, so even very tall columns on phones appear
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      elements.forEach((el) => el.classList.remove('apple-reveal', 'is-visible'))
    }
  }, [pathname])

  return null
}
