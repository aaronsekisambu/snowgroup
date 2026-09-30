import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import redirects from './redirects.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function contentRedirects() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'src/data/redirects.json'), 'utf8')
    const items = JSON.parse(raw)
    if (!Array.isArray(items)) return []
    return items
      .filter((item) => item?.from && item?.to)
      .map((item) => ({
        source: item.from.startsWith('/') ? item.from : `/${item.from}`,
        destination: item.to,
        permanent: item.statusCode === 301 || item.permanent === true,
      }))
  } catch {
    return []
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  redirects: async () => {
    const base = await redirects()
    return [...base, ...contentRedirects()]
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false
    }
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },
}

export default nextConfig
