'use client'

import React, { useEffect } from 'react'
import { usePageContext } from '@/providers/PageProvider'

const PageClient: React.FC = () => {
  const { setHeaderStyle, setFooterLayout } = usePageContext()

  useEffect(() => {
    // Reset header and footer overrides for archive pages
    setHeaderStyle(null)
    setFooterLayout(null)
  }, [setHeaderStyle, setFooterLayout])

  return <React.Fragment />
}

export default PageClient
