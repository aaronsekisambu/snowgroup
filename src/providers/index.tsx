import React from 'react'

import { ThemeProvider } from './Theme'
import { ThemeLayoutAnimation } from "./ThemeLayoutAnimation";
import { PageProvider } from './PageProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <ThemeLayoutAnimation>
        <PageProvider>
          {children}
        </PageProvider>
      </ThemeLayoutAnimation>
    </ThemeProvider>
  )
}
