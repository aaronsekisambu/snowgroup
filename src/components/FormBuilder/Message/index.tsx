import RichText from '@/components/RichText'
import React from 'react'
import { Width } from '../Width'

export const Message: React.FC<{ message?: string | null }> = ({ message }) => {
  return (
    <Width className="mil-mb30" width="50">
      <div className="mil-text-sm mil-up">{message && <RichText data={message} />}</div>
    </Width>
  )
}
