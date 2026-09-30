import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Block, ReusableBlock as ReusableBlockProps, ReusableContent } from '@/types/content'
import { getReusable } from '@/lib/content'

export const ReusableBlock: React.FC<ReusableBlockProps> = async ({
  reusableContent,
  customId,
  bg_style,
  padding_top,
  padding_bottom,
}) => {
  let layout: Block[] | null | undefined

  if (typeof reusableContent === 'object' && reusableContent?.layout) {
    layout = reusableContent.layout
  } else {
    const id =
      typeof reusableContent === 'object'
        ? reusableContent?.slug || reusableContent?.id
        : reusableContent
    const resolved: ReusableContent | null = id ? getReusable(String(id)) : null
    layout = resolved?.layout
  }

  if (!layout) return null

  return (
    <div
      {...(customId ? { id: customId } : {})}
      className={`mil-${bg_style}-section mil-p-${padding_top}-${padding_bottom}`}
    >
      <RenderBlocks blocks={layout} />
    </div>
  )
}
