'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

interface PageContextType {
  headerStyle?: string | null
  footerLayout?: string | null
  setHeaderStyle: (style: string | null) => void
  setFooterLayout: (layout: string | null) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [headerStyle, setHeaderStyle] = useState<string | null>(null)
  const [footerLayout, setFooterLayout] = useState<string | null>(null)

  return (
    <PageContext.Provider value={{ headerStyle, setHeaderStyle, footerLayout, setFooterLayout }}>
      {children}
    </PageContext.Provider>
  )
}

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (!context) {
    return { headerStyle: null, setHeaderStyle: () => {}, footerLayout: null, setFooterLayout: () => {} }
  }
  return context
}
