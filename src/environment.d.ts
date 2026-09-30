declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      NEXT_PUBLIC_FORMSPREE_URL?: string
      NEXT_PUBLIC_MAILCHIMP_ACTION_URL?: string
      NEXT_PUBLIC_MAILCHIMP_PUBLIC_KEY?: string
    }
  }
}

export {}
