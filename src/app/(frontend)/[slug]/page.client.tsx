'use client'

import React, { useEffect, useMemo } from 'react'
import { usePageContext } from '@/providers/PageProvider'
import type { Page } from '@/types/content'

const PageClient: React.FC<{ page?: Page }> = ({ page }) => {
  const { setHeaderStyle } = usePageContext()
  const headerStyle = useMemo(() => page?.headerStyle || null, [page?.headerStyle])
  const footerLayout = useMemo(() => page?.footerLayout || null, [page?.footerLayout])

  useEffect(() => {
    // Set the header style from the page, or reset to null if not set
    setHeaderStyle(headerStyle)
  }, [headerStyle, setHeaderStyle])
  
  // footer layout override
  const { setFooterLayout } = usePageContext()

  useEffect(() => {
    setFooterLayout(footerLayout)
  }, [footerLayout, setFooterLayout])

  return <React.Fragment />
}

export default PageClient
