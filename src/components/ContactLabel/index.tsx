import React from 'react'

// Contact details are labelled with an icon (WhatsApp, email, visit); the word stays for screen readers
const ICONS: Record<string, string> = {
  whatsapp: 'fab fa-whatsapp',
  email: 'fal fa-envelope',
  visit: 'fal fa-map-marker-alt',
  phone: 'fal fa-phone',
}

export const ContactLabel: React.FC<{ label?: string | null; colon?: boolean }> = ({ label, colon }) => {
  const icon = ICONS[(label || '').toLowerCase().replace(/[^a-z]/g, '')]
  if (!icon) return <>{label}{colon ? ':' : ''}</>
  return (
    <span className="snow-contact-label" title={label || undefined}>
      <i className={icon} aria-hidden="true"></i>
      <span className="snow-sr-only">{label}</span>
    </span>
  )
}
