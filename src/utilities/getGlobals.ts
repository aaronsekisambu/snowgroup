import { getGlobal, getGlobalMeta } from '@/lib/content'

export const getCachedGlobal = (slug: string, _depth = 0) => async () => getGlobal(slug)

export const getCachedGlobalMeta = (slug: string, _depth = 0) => async () => getGlobalMeta(slug)
