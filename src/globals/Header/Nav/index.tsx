'use client'

import React from 'react'

import type { Header as HeaderType } from '@/types/content'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  
  return (
    <ul className="mil-main-menu">
      {navItems.map(({ link }, i) => {
        if (!link || link.hidden) return null
        return <CMSLink key={i} {...link} index={i} appearance="link" />
      })}
    </ul>
  )
}
