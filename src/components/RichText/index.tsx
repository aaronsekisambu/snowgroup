import React from 'react'
import { cn } from '@/utilities/ui'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Props = {
  data?: string | null | object
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, data, enableProse = false, enableGutter = false } = props
  const html = typeof data === 'string' ? data : ''

  if (!html) return null

  return (
    <div
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto': enableProse,
        },
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
    />
  )
}
