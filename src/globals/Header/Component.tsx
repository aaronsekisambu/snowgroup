import { HeaderClient } from './Component.client'
import { getHeader } from '@/lib/content'
import React from 'react'

export async function Header() {
  const headerData = getHeader()
  return <HeaderClient data={headerData} />
}
