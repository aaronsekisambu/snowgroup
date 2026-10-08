import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import type {
  Block,
  Blog,
  Category,
  Faq,
  General,
  Header,
  Footer,
  Page,
  Plan,
  Post,
  ProductCategory,
  ProductPage,
  Project,
  ProjectsPage,
  Redirect,
  ReusableContent,
  Service,
  ServiceCategory,
  ServiceTemplate,
  ServicesPage,
  SubMenuItem,
  Team,
  TeamPage,
} from '@/types/content'
import { dataDir, listJsonFiles, listMdFiles, paginate, readJsonFile, slugFromFilename } from './fs'

type CollectionGlobal = Blog | ProjectsPage | ServicesPage | TeamPage

export function getAppSettings() {
  return readJsonFile<{ settings?: { siteName?: string; siteDescription?: string; formspreeURL?: string; mailchimp?: { url?: string; key?: string }; perPage?: number } }>(
    path.join(dataDir, 'app.json'),
  )
}

export function getHeader(): Header {
  const header = readJsonFile<Header>(path.join(dataDir, 'header.json')) || {}
  return {
    ...header,
    navItems: header.navItems?.map((item) => {
      const buildSubmenu = item.link?.submenuSource ? submenuSources[item.link.submenuSource] : undefined
      return buildSubmenu ? { ...item, link: { ...item.link, submenu: buildSubmenu() } } : item
    }),
  }
}

export function getFooter(): Footer {
  return readJsonFile<Footer>(path.join(dataDir, 'footer.json')) || {}
}

export function getGeneral(): General {
  return readJsonFile<General>(path.join(dataDir, 'general.json')) || {}
}

// Single source for the plans shown in every plans section
export function getPlans(): Plan[] {
  return readJsonFile<{ plans?: Plan[] }>(path.join(dataDir, 'plans.json'))?.plans || []
}

// Every page a visitor can reach, grouped for the sitemap page; built from the same data as the menus
function getSitemapGroups() {
  const pages = (slugs: [string, string][]) => slugs.map(([label, url]) => ({ label, url }))
  return [
    { title: 'Main pages', links: pages([['Home', '/'], ['Services', '/services'], ['Projects', '/projects'], ['Plans', '/plans'], ['FAQ', '/faq'], ['Contact', '/contact']]) },
    ...getServiceCategories().map((category) => ({
      title: `Services: ${category.title}`,
      links: category.items.map((item) => ({ label: item.title, url: `/services/${item.slug}` })),
    })),
    { title: 'Products', links: getProductCategories().map((category) => ({ label: category.title, url: `/products/${category.slug}` })) },
    { title: 'Projects', links: getAllProjects().map((project) => ({ label: project.title || project.slug, url: `/projects/${project.slug}` })) },
    { title: 'Legal', links: pages([['Legal Information', '/legal-information'], ['Privacy Policy', '/privacy-policy'], ['Terms and Conditions', '/terms-and-conditions'], ['Cookie Policy', '/cookie-policy'], ['License', '/license'], ['Sitemap', '/sitemap']]) },
  ]
}

// Single source for the FAQs, grouped (e.g. "general", "projects")
export function getFaqs(group: string): Faq[] {
  return readJsonFile<{ groups?: Record<string, Faq[]> }>(path.join(dataDir, 'faqs.json'))?.groups?.[group] || []
}

type BlockLayouts = {
  layout?: Block[] | null
  layout_before?: Block[] | null
  layout_after?: Block[] | null
}

// Fills sections that point at shared content:
// "plansSource": "plans" shows the shared plans (the card style stays per section),
// "faqsSource": "<group>" shows that group of shared FAQs
function withSharedContent<T extends BlockLayouts>(doc: T): T {
  const fill = (blocks: Block[]) =>
    blocks.map((block) => {
      if (block.plansSource === 'plans') {
        return { ...block, plans: getPlans().map((plan) => ({ ...plan, card_style: block.card_style ?? plan.card_style })) }
      }
      if (block.faqsSource) {
        return { ...block, faqs: getFaqs(block.faqsSource) }
      }
      if (block.linksSource === 'sitemap') {
        return { ...block, link_groups: getSitemapGroups() }
      }
      return block
    })
  const result = { ...doc }
  for (const key of ['layout', 'layout_before', 'layout_after'] as const) {
    const blocks = doc[key]
    if (blocks) result[key] = fill(blocks)
  }
  return result
}

export function getBlog(): Blog {
  return withSharedContent(readJsonFile<Blog>(path.join(dataDir, 'blog.json')) || {})
}

export function getProjectsPage(): ProjectsPage {
  return withSharedContent(readJsonFile<ProjectsPage>(path.join(dataDir, 'projects-page.json')) || {})
}

export function getServicesPage(): ServicesPage {
  return withSharedContent(readJsonFile<ServicesPage>(path.join(dataDir, 'services-page.json')) || {})
}

export function getTeamPage(): TeamPage {
  return withSharedContent(readJsonFile<TeamPage>(path.join(dataDir, 'team-page.json')) || {})
}

export function getGlobal(slug: string): CollectionGlobal | Header | Footer | General {
  switch (slug) {
    case 'header':
      return getHeader()
    case 'footer':
      return getFooter()
    case 'general':
      return getGeneral()
    case 'blog':
      return getBlog()
    case 'projects_page':
      return getProjectsPage()
    case 'services_page':
      return getServicesPage()
    case 'team_page':
      return getTeamPage()
    default:
      return {}
  }
}

export function getGlobalMeta(slug: string) {
  const data = getGlobal(slug) as CollectionGlobal
  return { meta: data.meta }
}

export function getRedirects(): Redirect[] {
  return readJsonFile<Redirect[]>(path.join(dataDir, 'redirects.json')) || []
}

export function getReusable(id: string): ReusableContent | null {
  return readJsonFile<ReusableContent>(path.join(dataDir, 'reusable', `${id}.json`))
}

export function getCategories(): Category[] {
  return listJsonFiles(path.join(dataDir, 'categories')).map((file) => {
    const data = readJsonFile<Category>(file) || {}
    return { ...data, slug: data.slug || slugFromFilename(file) }
  })
}

// The page served at "/"; it is also reachable at its own slug, which points search engines back to "/"
export const HOME_PAGE_SLUG = 'home-5'

// Pages left over from the site template; they still render but stay out of the sitemap and search results
export const TEMPLATE_PAGE_SLUGS = ['home', 'home-2', 'home-3', 'home-4']

export function getAllPages(): Page[] {
  return listJsonFiles(path.join(dataDir, 'pages')).map((file) => {
    const data = readJsonFile<Page>(file)
    return { ...(data || { slug: slugFromFilename(file) }), slug: data?.slug || slugFromFilename(file) }
  })
}

export function getAllPageSlugs() {
  return getAllPages()
    .filter((page) => page.slug && page.slug !== 'home')
    .map((page) => ({ slug: page.slug }))
}

export function getPageBySlug(slug: string): Page | null {
  const page = readJsonFile<Page>(path.join(dataDir, 'pages', `${slug}.json`))
  return page ? withSharedContent(page) : null
}

function readPosts(): Post[] {
  return listMdFiles(path.join(dataDir, 'posts')).map((file) => {
    const raw = fs.readFileSync(file, 'utf8')
    const parsed = matter(raw)
    const slug = slugFromFilename(file)
    const data = parsed.data as Partial<Post>
    return {
      ...data,
      slug: data.slug || slug,
      content: parsed.content?.trim() || data.content || '',
    } as Post
  })
}

export function getSortedPosts(): Post[] {
  return readPosts().sort((a, b) => {
    const da = a.publishedAt || ''
    const db = b.publishedAt || ''
    return db.localeCompare(da)
  })
}

async function markdownToHtml(markdown: string) {
  const trimmed = markdown.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('<')) return trimmed
  const file = await remark().use(remarkHtml).process(trimmed)
  return String(file)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const post = getSortedPosts().find((item) => item.slug === slug) || null
  if (!post) return null
  const related = pickRelated(post.relatedPosts, getSortedPosts(), (item) => ({
    slug: item.slug,
    title: item.title,
    categories: (item.categories || []).map((cat) => ({ title: cat.title, slug: cat.slug })),
    meta: item.meta,
    populatedAuthors: item.populatedAuthors,
    publishedAt: item.publishedAt,
  }))
  return { ...post, content: await markdownToHtml(post.content || ''), relatedPosts: related }
}

export function getPosts(page = 1, limit = 6) {
  return paginate(getSortedPosts(), page, limit)
}

export function getAllPostSlugs() {
  return getSortedPosts().map((post) => ({ slug: post.slug }))
}

function sortByOrder<T extends { order?: number | null; title?: string | null }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.title || '').localeCompare(b.title || ''))
}

function readCollectionJson<T extends { slug?: string }>(folder: string): T[] {
  return listJsonFiles(path.join(dataDir, folder)).map((file) => {
    const data = readJsonFile<T>(file) || ({} as T)
    return { ...data, slug: data.slug || slugFromFilename(file) }
  })
}

export function getAllProjects(): Project[] {
  return sortByOrder(readCollectionJson<Project>('projects'))
}

function pickRelated<T extends { slug: string }>(
  related: T[] | null | undefined,
  all: T[],
  pick: (doc: T) => T,
): T[] {
  return (related || []).flatMap((item) => {
    const full = all.find((doc) => doc.slug === item.slug)
    return full ? [pick(full)] : item.slug ? [item] : []
  })
}

export function getProjectBySlug(slug: string): Project | null {
  const project = getAllProjects().find((item) => item.slug === slug) || null
  if (!project) return null
  return {
    ...project,
    relatedProjects: pickRelated(project.relatedProjects, getAllProjects(), (item) => ({
      slug: item.slug,
      title: item.title,
      short_description: item.short_description,
      price: item.price,
      publishedAt: item.publishedAt,
      category: item.category,
      location: item.location,
      meta: item.meta,
    })),
  }
}

export function getProjects(page = 1, limit = 6) {
  return paginate(getAllProjects(), page, limit)
}

export function getAllProjectSlugs() {
  return getAllProjects().map((item) => ({ slug: item.slug }))
}

export function getAllServices(): Service[] {
  return sortByOrder(readCollectionJson<Service>('services'))
}

// Single source for the categorised services; swap this for a CRM/API call to make it dynamic
export function getServiceCategories(): ServiceCategory[] {
  return readJsonFile<{ categories?: ServiceCategory[] }>(path.join(dataDir, 'service-categories.json'))?.categories || []
}

function fillTemplate<T>(value: T, vars: Record<string, string>): T {
  if (typeof value === 'string') {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key: string) => vars[key] ?? match) as T
  }
  if (Array.isArray(value)) return value.map((item) => fillTemplate(item, vars)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillTemplate(item, vars)])) as T
  }
  return value
}

// Every category item becomes a service page rendered from the shared service template
export function getCategoryServices(): Service[] {
  const template = readJsonFile<ServiceTemplate>(path.join(dataDir, 'service-template.json')) || {}
  return getServiceCategories().flatMap((category) =>
    category.items.map((item) => {
      const vars = { title: item.title, short: item.short || '', category: category.title }
      const meta = fillTemplate(template.meta, vars)
      // the service's own photo and page content replace the template defaults
      const layout = fillTemplate(template.layout, vars)?.map((block) => {
        if (block.blockType === 'intro' && item.image) return { ...block, bgImage: item.image }
        if (block.blockType !== 'about_service') return block
        return {
          ...block,
          ...(item.right_title && { right_title: item.right_title }),
          ...(item.description && { description: item.description }),
          ...(item.features && { features: item.features }),
          ...(item.steps && { process_steps: item.steps }),
          ...(item.deliverables && { deliverables: item.deliverables }),
        }
      })
      return {
        slug: item.slug,
        title: item.title,
        short: item.short,
        list: item.list?.map((text) => ({ text })),
        meta: { ...meta, ...(item.image && { image: item.image }) },
        layout,
        relatedServices: category.items
          .filter((other) => other.slug !== item.slug)
          .map((other) => ({ slug: other.slug })),
      }
    }),
  )
}

function getServiceCategoriesSubmenu(): SubMenuItem[] {
  return getServiceCategories().map((category) => ({
    label: category.title,
    sub_items: category.items.map((item) => ({
      sub_type: 'reference',
      sub_reference: { relationTo: 'services', value: { slug: item.slug } },
      label: item.title,
    })),
  }))
}

export function getServiceBySlug(slug: string): Service | null {
  const allServices = [...getAllServices(), ...getCategoryServices()]
  const service = allServices.find((item) => item.slug === slug) || null
  if (!service) return null
  return {
    ...service,
    relatedServices: pickRelated(service.relatedServices, allServices, (item) => ({
      slug: item.slug,
      title: item.title,
      short: item.short,
      list: item.list,
      meta: item.meta,
    })),
  }
}

export function getServices(page = 1, limit = 9) {
  return paginate(getAllServices(), page, limit)
}

export function getAllServiceSlugs() {
  return [...getAllServices(), ...getCategoryServices()].map((item) => ({ slug: item.slug }))
}

// Single source for the product categories; swap this for a CRM/API call to make it dynamic
export function getProductCategories(): ProductCategory[] {
  return readJsonFile<{ categories?: ProductCategory[] }>(path.join(dataDir, 'product-categories.json'))?.categories || []
}

// Every product category gets a page rendered from the shared product template, listing its items
export function getProductPages(): ProductPage[] {
  const template = readJsonFile<ServiceTemplate>(path.join(dataDir, 'product-template.json')) || {}
  return getProductCategories().map((category) => {
    const vars = { title: category.title, short: category.short || '' }
    const layout = fillTemplate(template.layout, vars)?.map((block) => {
      if (block.blockType === 'intro' && category.image) return { ...block, bgImage: category.image }
      if (block.featuresSource !== 'items') return block
      return {
        ...block,
        side_image: category.image,
        features: category.items.map((item) => ({ title: item.title, description: item.description, image: item.image })),
      }
    })
    return { slug: category.slug, title: category.title, meta: fillTemplate(template.meta, vars), layout }
  })
}

export function getProductPageBySlug(slug: string): ProductPage | null {
  return getProductPages().find((page) => page.slug === slug) || null
}

export function getAllProductSlugs() {
  return getProductCategories().map((category) => ({ slug: category.slug }))
}

// Only the categories are links; their items show as text underneath
function getProductCategoriesSubmenu(): SubMenuItem[] {
  return getProductCategories().map((category) => ({
    sub_type: 'custom',
    sub_url: `/products/${category.slug}`,
    label: category.title,
    description: category.items.map((item) => item.title).join(' · '),
  }))
}

// Header dropdowns that are built from data, by their "submenuSource" name
const submenuSources: Record<string, () => SubMenuItem[]> = {
  service_categories: getServiceCategoriesSubmenu,
  product_categories: getProductCategoriesSubmenu,
}

export function getAllTeam(): Team[] {
  return sortByOrder(readCollectionJson<Team>('team'))
}

export function getTeamBySlug(slug: string): Team | null {
  const member = getAllTeam().find((item) => item.slug === slug) || null
  if (!member) return null
  return {
    ...member,
    relatedTeam: pickRelated(member.relatedTeam, getAllTeam(), (item) => ({
      slug: item.slug,
      title: item.title,
      short: item.short,
      meta: item.meta,
    })),
  }
}

export function getTeam(page = 1, limit = 8) {
  return paginate(getAllTeam(), page, limit)
}

export function getAllTeamSlugs() {
  return getAllTeam().map((item) => ({ slug: item.slug }))
}

function filterByCategories<T extends { categories?: Category[] | null }>(items: T[], categorySlugs?: (string | null | undefined)[]) {
  const slugs = (categorySlugs || []).filter(Boolean) as string[]
  if (!slugs.length) return items
  return items.filter((item) =>
    (item.categories || []).some((cat) => slugs.includes(cat.slug || cat.title || '')),
  )
}

export function queryBlogArchivePosts(categorySlugs: (string | null | undefined)[] | undefined, limit = 3): Post[] {
  return filterByCategories(getSortedPosts(), categorySlugs).slice(0, limit)
}

export function queryProjectsGridBlock(categorySlugs: (string | null | undefined)[] | undefined, limit = 6): Project[] {
  return filterByCategories(getAllProjects(), categorySlugs).slice(0, limit)
}

export function queryTeamBlock(categorySlugs: (string | null | undefined)[] | undefined, limit = 3): Team[] {
  return filterByCategories(getAllTeam(), categorySlugs).slice(0, limit)
}

export function getPagesSitemap() {
  return getAllPages()
}

export function getPostsSitemap() {
  return getSortedPosts()
}
