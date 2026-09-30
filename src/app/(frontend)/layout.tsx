import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/globals/Footer/Component'
import { Header } from '@/globals/Header/Component'
import { Preloader } from '@/components/Preloader'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph, SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Google Fonts
import { Montserrat, Reenie_Beanie } from 'next/font/google'

// Brand typeface (Snow Holdings brand guidelines)
const primary_font = Montserrat({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  adjustFontFallback: false,
})

const secondary_font = Reenie_Beanie({
  weight: ['400'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-secondary',
  display: 'swap',
  adjustFontFallback: false,
})

// Global CSS
import './globals.css'

// CSS Plugins
import "@styles/css/plugins/fontawesome.css";
import "@styles/css/plugins/line-awesome.css";
import "@styles/css/plugins/bootstrap-grid.css";
import "@styles/css/plugins/swiper.css";

// SCSS
import '@styles/scss/style.scss';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${primary_font.variable} ${secondary_font.variable}`} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="any" />
        <link href="/icon-32.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            <Preloader />
            {/* wrapper */}
            <div id="smooth-wrapper" className="mil-page-wrapper">
              <div className="mil-cursor-follower"></div>

              <div className="mil-progress-track">
                <div className="mil-progress"></div>
              </div>

              <Header />
              
              {/* page transition */}
              <div className="mil-transition-fade" id="swup">
                <div className="mil-transition-frame">
                  {/* content */}
                  <div id="smooth-content" className="mil-content">
                    {children}

                    <Footer />
                  </div>
                  {/* content */}
                </div>
              </div>
              {/* page transition */}
            </div>
            {/* wrapper end */}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
}
