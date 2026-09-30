import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

import type { SubMenuItem } from '@/types/content'

export const SubCMSLink: React.FC<SubMenuItem> = (props) => {
  const asPath = usePathname();

  const isPathActive = (path: string) => {
    if ( path === '/' && asPath === path ) {
      return true;
    } else {
      return (asPath.indexOf(path) !== -1) && asPath === path && path !== '/';
    }
  };

  const {
    sub_type,
    label,
    sub_newTab,
    sub_reference,
    sub_url,
  } = props

  const href =
    sub_type === 'reference' && typeof sub_reference?.value === 'object' && sub_reference.value.slug
      ? `${sub_reference?.relationTo !== 'pages' ? `/${sub_reference?.relationTo}` : ''}/${
          sub_reference.value.slug
        }`
      : sub_url

  if (!href) return null

  const newTabProps = sub_newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <Link href={href || sub_url || ''} {...newTabProps} className={isPathActive((href)) ? "mil-current": ""}>
        {label && label}
    </Link>
  )
}
