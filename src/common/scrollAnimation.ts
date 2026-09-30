import { gsap } from "gsap"
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

type ScrollAnimationRoot = Document | HTMLElement

/**
 * ScrollAnimation - Initializes scroll-based animations and interactions
 * Handles smooth scrolling, animations, and UI state based on scroll position
 * @param root - The root element or document to scope DOM queries
 * @returns Cleanup function to remove all event listeners and animations
 */
export const ScrollAnimation = (root: ScrollAnimationRoot = document): (() => void) => {
    gsap.registerPlugin(ScrollTrigger)

    const doc = root instanceof Document ? root : root.ownerDocument || document

    /* -------------------------------------------
    mobile panel fix
    ------------------------------------------- */
    function setHeight(): void {
        const vh = window.innerHeight * 0.01
        doc.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setHeight()
    const handleResize = (): void => setHeight()
    window.addEventListener('resize', handleResize)

    /* -------------------------------------------
    smooth scroll
    ------------------------------------------- */
    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number): void => {
        lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)

    gsap.ticker.lagSmoothing(0)

    /* -------------------------------------------
    top panel
    ------------------------------------------- */
    const infoWindowFrame = root.querySelector?.('.mil-info-window-frame') as HTMLElement | null
    const topPanel = root.querySelector?.('.mil-top-panel') as HTMLElement | null
    // `links` was collected originally for some behaviour but is unused
    // in the current implementation; drop it to satisfy lint rules.

    function handleScroll(): void {
        const scrollY = window.scrollY || window.pageYOffset
        const threshold = 10 * parseFloat(getComputedStyle(doc.documentElement).fontSize || '16')

        if (topPanel) {
            topPanel.classList.toggle('mil-scroll', scrollY >= threshold)
        }
        if (infoWindowFrame) {
            infoWindowFrame.classList.toggle('mil-scroll', scrollY >= threshold)
        }
    }

    if (topPanel || infoWindowFrame) {
        window.addEventListener('scroll', handleScroll)
    }

    /* -------------------------------------------
    anchor smooth scroll (use delegation)
    ------------------------------------------- */
    const onDocumentClick = (e: Event): void => {
        const target = (e.target as HTMLElement).closest?.('a[href^="#"]:not([href="#"])') as HTMLAnchorElement | null
        if (!target) return

        const href = target.getAttribute('href')
        if (!href || !href.startsWith('#')) return

        const targetId = href.slice(1)
        const safeSelector = `#${CSS.escape(targetId)}`
        const targetEl = root.querySelector?.(safeSelector) || doc.querySelector(safeSelector) as HTMLElement | null

        if (targetEl) {
            e.preventDefault()
            const offsetPx = remOffset * getRemInPx()
            const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - offsetPx

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    document.addEventListener('click', onDocumentClick)

    /* -------------------------------------------
    order a call
    ------------------------------------------- */
    const openBtn = root.querySelector?.('.mil-open-window') as HTMLElement | null
    const closeBtn = root.querySelector?.('.mil-close-popup') as HTMLElement | null
    const orderCallFrame = root.querySelector?.('.mil-order-call-frame') as HTMLElement | null
    const rightButtonsFrame = root.querySelector?.('.mil-right-buttons-frame') as HTMLElement | null

    const openClick = (): void => orderCallFrame?.classList.add('mil-active')
    const closeClick = (): void => orderCallFrame?.classList.remove('mil-active')

    if (openBtn && closeBtn && orderCallFrame) {
        openBtn.addEventListener('click', openClick)
        closeBtn.addEventListener('click', closeClick)
    }

    const onScrollRightButtons = (): void => {
        const rem = parseFloat(getComputedStyle(doc.documentElement).fontSize || '16')
        const scrollThreshold = 20 * rem
        const bottomOffset = 20 * rem

        const scrollY = window.scrollY || window.pageYOffset
        const windowHeight = window.innerHeight
        const docHeight = doc.documentElement.scrollHeight

        if (scrollY >= scrollThreshold) {
            rightButtonsFrame?.classList.add('mil-active')
        } else {
            rightButtonsFrame?.classList.remove('mil-active')
        }

        if (scrollY + windowHeight >= docHeight - bottomOffset) {
            rightButtonsFrame?.classList.add('mil-on-bottom')
        } else {
            rightButtonsFrame?.classList.remove('mil-on-bottom')
        }
    }

    window.addEventListener('scroll', onScrollRightButtons)

    const remOffset = 12
    const getRemInPx = (): number => parseFloat(getComputedStyle(doc.documentElement).fontSize || '16')

    /* -------------------------------------------
    animation
    ------------------------------------------- */
    const initAnimations = (): void => {
        const selectAll = (sel: string): HTMLElement[] => Array.from(root.querySelectorAll?.(sel) || [])

        const scaleImage = selectAll('.mil-scale-img')
        if (scaleImage.length) {
            scaleImage.forEach((section) => {
                let value1 = section.getAttribute('data-value-1')
                const value2 = section.getAttribute('data-value-2')
                if (!value1 || !value2) return

                const val1 = parseFloat(value1)
                const val2 = parseFloat(value2)

                if (window.innerWidth < 1200) {
                    value1 = Math.max(0.95, val1).toString()
                }

                gsap.fromTo(
                    section,
                    {
                        ease: 'sine',
                        scale: parseFloat(value1),
                    },
                    {
                        scale: val2,
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            toggleActions: 'play none none reverse',
                        }
                    }
                )
            })
        }

        const scaleImageTop = selectAll('.mil-scale-img-top')
        if (scaleImageTop.length && window.innerWidth >= 1200) {
            scaleImageTop.forEach((section) => {
                const value1 = section.getAttribute('data-value-1')
                const value2 = section.getAttribute('data-value-2')
                if (!value1 || !value2) return

                gsap.fromTo(
                    section,
                    {
                        ease: 'sine',
                        scale: parseFloat(value1),
                    },
                    {
                        scale: parseFloat(value2),
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            start: 'top top',
                            toggleActions: 'play none none reverse',
                        }
                    }
                )
            })
        }

        const scaleImageAlt = selectAll('.mil-scale-img-alt')
        if (scaleImageAlt.length && window.innerWidth >= 1200) {
            scaleImageAlt.forEach((section) => {
                const value1 = section.getAttribute('data-value-1')
                const value2 = section.getAttribute('data-value-2')
                if (!value1 || !value2) return

                gsap.fromTo(
                    section,
                    {
                        ease: 'sine',
                        scale: parseFloat(value1),
                    },
                    {
                        scale: parseFloat(value2),
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            start: 'top-=100%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                )
            })
        }

        const rotate = selectAll('.mil-rotate')
        if (rotate.length) {
            rotate.forEach((section) => {
                const value = section.getAttribute('data-value')
                if (!value) return

                gsap.fromTo(
                    section,
                    {
                        ease: 'sine',
                        rotate: 0,
                    },
                    {
                        rotate: parseFloat(value),
                        scrollTrigger: {
                            trigger: section,
                            scrub: true,
                            toggleActions: 'play none none reverse',
                        }
                    }
                )
            })
        }

        const numbers = selectAll('.mil-counter')
        if (numbers.length) {
            numbers.forEach((element) => {
                const numberAttr = element.dataset.number
                if (!numberAttr) return

                const num = parseFloat(numberAttr)
                const split = num.toString().split('.')
                const decimals = split.length > 1 ? split[1].length : 0
                const zero: { val: number } = { val: 0 }

                gsap.to(zero, {
                    val: num,
                    duration: 1.8,
                    scrollTrigger: {
                        trigger: element,
                        toggleActions: 'play none none reverse',
                    },
                    onUpdate: function () {
                        element.textContent = zero.val.toFixed(decimals)
                    }
                })
            })
        }

        const prog = selectAll('.mil-skill-prog')
        if (prog.length) {
            prog.forEach((section) => {
                const value = section.getAttribute('data-value')
                if (!value) return

                gsap.fromTo(
                    section,
                    {
                        ease: 'sine',
                        width: 0,
                    },
                    {
                        width: value,
                        scrollTrigger: {
                            trigger: section,
                            toggleActions: 'play none none reverse',
                        }
                    }
                )
            })
        }
    }

    initAnimations()

    /* replace accent words safely (text-node replacement) */
    const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    Array.from(root.querySelectorAll?.('*[data-accent-words]') || []).forEach((element) => {
        const htmlElement = element as HTMLElement & { dataset: { accentWords?: string; accentColor?: string } }

        if (htmlElement.dataset.accentWords) {
            const words = htmlElement.dataset.accentWords.split(',').map(w => w.trim()).filter(Boolean)
            if (!words.length) return

            const color = htmlElement.dataset.accentColor === 'secondary' ? 'a2' : 'a1'
            const wordsSet = new Set(words)
            const regex = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'g')

            const walker = doc.createTreeWalker(htmlElement, NodeFilter.SHOW_TEXT, null)
            const textNodes: Node[] = []
            let currentNode: Node | null
            while ((currentNode = walker.nextNode())) {
                textNodes.push(currentNode)
            }

            textNodes.forEach((textNode) => {
                const text = textNode.nodeValue || ''
                if (!regex.test(text)) return

                const parts = text.split(regex)
                const frag = doc.createDocumentFragment()

                parts.forEach(part => {
                    if (wordsSet.has(part)) {
                        const span = doc.createElement('span')
                        span.className = `mil-${color}`
                        span.textContent = part
                        frag.appendChild(span)
                    } else {
                        frag.appendChild(doc.createTextNode(part))
                    }
                })

                textNode.parentNode?.replaceChild(frag, textNode)
            })
        }
    })

    /* add current class for menu items */
    Array.from(root.querySelectorAll?.('.mil-main-menu a') || []).forEach((element) => {
        const anchor = element as HTMLAnchorElement
        if (anchor.classList.contains('mil-current')) {
            anchor.parentElement?.classList.add('mil-current')
        } else {
            anchor.parentElement?.classList.remove('mil-current')
        }
    })

    // Return cleanup function
    return (): void => {
        window.removeEventListener('resize', handleResize)
        gsap.ticker.remove(tick)
        try {
            lenis.off?.('scroll', ScrollTrigger.update)
        } catch (_ignore) {
            // Silently handle cleanup errors
        }
        document.removeEventListener('click', onDocumentClick)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('scroll', onScrollRightButtons)
        if (openBtn && closeBtn && orderCallFrame) {
            openBtn.removeEventListener('click', openClick)
            closeBtn.removeEventListener('click', closeClick)
        }
    }
}

/**
 * PreloaderAnimation - Handles preloader animation and counter
 * @param root - The root element or document to scope DOM queries
 * @returns Cleanup function to clear timeouts and animation frames
 */
export const PreloaderAnimation = (root: ScrollAnimationRoot = document): (() => void) => {
    gsap.registerPlugin(ScrollTrigger)

    const _doc = root instanceof Document ? root : root.ownerDocument || document

    const counterEl = root.querySelector?.('.mil-counter') as HTMLElement | null
    const lineEl = root.querySelector?.('.mil-mil-preloader-line') as HTMLElement | null
    const preloaderFrame = root.querySelector?.('.mil-preloader-frame') as HTMLElement | null
    const startDelay = 400
    const duration = 2000

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let rafId: number | undefined

    if (preloaderFrame && counterEl && lineEl) {
        timeoutId = setTimeout(() => {
            preloaderFrame.classList.add('mil-loading')

            let start: number | null = null

            const animate = (timestamp: number): void => {
                if (!start) start = timestamp
                const progress = Math.min((timestamp - start) / duration, 1)
                const value = Math.floor(progress * 100)

                counterEl.textContent = value.toString()
                lineEl.style.width = value + '%'

                if (progress < 1) {
                    rafId = requestAnimationFrame(animate)
                } else {
                    setTimeout(() => {
                        preloaderFrame.classList.remove('mil-loading')
                        setTimeout(() => {
                            preloaderFrame.classList.add('mil-ready')
                        }, 400)
                    }, 400)
                }
            }

            rafId = requestAnimationFrame(animate)
        }, startDelay)
    }

    return (): void => {
        if (timeoutId !== undefined) clearTimeout(timeoutId)
        if (rafId !== undefined) cancelAnimationFrame(rafId)
    }
}
