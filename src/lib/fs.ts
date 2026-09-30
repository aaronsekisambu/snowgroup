import fs from 'fs'
import path from 'path'

export const dataDir = path.join(process.cwd(), 'src/data')

export function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

export function listJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => path.join(dir, name))
}

export function listMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(dir, name))
}

export function slugFromFilename(filePath: string): string {
  return path.basename(filePath).replace(/\.(json|md)$/, '')
}

export function paginate<T>(items: T[], page = 1, limit = 6) {
  const totalDocs = items.length
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit))
  const current = Math.min(Math.max(page, 1), totalPages)
  const start = (current - 1) * limit
  return {
    docs: items.slice(start, start + limit),
    page: current,
    totalPages,
    totalDocs,
    limit,
  }
}
