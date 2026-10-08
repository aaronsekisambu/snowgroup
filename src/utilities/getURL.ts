import canUseDOM from './canUseDOM'

// Canonical address used in sitemaps, structured data and link previews
export const SITE_URL = 'https://www.snowgroup.ltd'

export const getServerSideURL = () => {
  return process.env.NEXT_PUBLIC_SERVER_URL || (process.env.VERCEL ? SITE_URL : 'http://localhost:3000')
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
