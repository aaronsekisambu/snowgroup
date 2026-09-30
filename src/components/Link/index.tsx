'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import type { CMSLink as CMSLinkData } from '@/types/content'
import { SubCMSLink } from '@/components/SubLink'

type CMSLinkType = CMSLinkData & {
  children?: React.ReactNode
  className?: string
  index?: number | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const asPath = usePathname();

  const {
    type,
    appearance = 'inline',
    children,
    label,
    newTab,
    reference,
    url,
    submenu,
    index
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const isPathActive = (path: string) => {
    const current = asPath ?? '/';
    if (!path) return false;

    const normalize = (p: string) => (p === '/' ? '/' : p.replace(/\/$/, ''));

    const normalizedPath = normalize(path);
    const normalizedCurrent = normalize(current);

    if (normalizedPath === '/') {
      return normalizedCurrent === '/';
    }

    return (
      normalizedCurrent === normalizedPath ||
      normalizedCurrent.startsWith(normalizedPath + '/')
    );
  };
  
  const handleSubMenuClick = (index: number | null, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if ( activeSubMenu !== index ) {
      setActiveSubMenu(index);
    } else {
      setActiveSubMenu(null);
    }
  };

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link href={href || url || ''} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    )
  }
  
  const hasSubmenu = !!submenu && submenu.length > 0
  const isMegaMenu = hasSubmenu && submenu.some((link) => (link.sub_items && link.sub_items.length > 0) || link.description)
  const itemIndex = index ? index : 0

  const handleLinkClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!hasSubmenu) return

    const isPlaceholder = href == '#.' || href == '#'
    const isMobile = window.matchMedia('(max-width: 992px)').matches

    // On mobile a tap toggles the submenu instead of following the link
    if (isPlaceholder || isMobile) {
      handleSubMenuClick(itemIndex, e)
    }
  };

  let itemClass = '';
  if ( hasSubmenu ) { itemClass += ' mil-has-children' }
  if ( isMegaMenu ) { itemClass += ' mil-has-mega' }
  if ( activeSubMenu === itemIndex ) { itemClass += ' mil-active' }

  return (
    <li className={itemClass}>
      <Link href={href || url || ''} {...newTabProps} onClick={handleLinkClick} className={isPathActive((href)) ? "mil-current": ""}>
        {label && label}
        {children && children}
      </Link>
      {hasSubmenu &&
      <ul className={isMegaMenu ? 'mil-mega-menu' : ''}>
        {submenu.map((link, i) => {
          if (link.sub_items && link.sub_items.length > 0) {
            return (
              <li key={i} className="mil-submenu-group">
                {link.label && <span className="mil-submenu-title">{link.label}</span>}
                <ul className="mil-submenu-links">
                  {link.sub_items.map((subLink, j) => {
                    return <li key={j}><SubCMSLink {...subLink} /></li>
                  })}
                </ul>
              </li>
            )
          }
          if (link.description) {
            return (
              <li key={i} className="mil-submenu-group mil-submenu-category">
                <SubCMSLink {...link} />
                <span className="mil-submenu-text">{link.description}</span>
              </li>
            )
          }
          return <li key={i}><SubCMSLink {...link} /></li>
        })}
      </ul>
      }
    </li>
  )
}
