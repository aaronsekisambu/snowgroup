import * as React from 'react'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  return (
    <div className={`${className ? className : ''} mil-mb-1`} style={{ maxWidth: width ? `${width}%` : undefined }}>
      <div className="mil-input-frame">
        {children}
      </div>
    </div>
  )
}
