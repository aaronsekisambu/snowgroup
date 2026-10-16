import type { Block, Media, OverviewData, Project, SnowCardData } from '@/types/content'
import {
  getAllProjects,
  getPriceList,
  getProductCategories,
  getProductOverview,
  getProductSpecs,
  getServiceCategories,
} from './content'

/* -------------------------------------------

Overview pages for products, product categories, services and projects.
Each one is built only from content the site already has, so nothing is invented here.
Photos borrowed from a project are captioned with that project's name.

------------------------------------------- */

const plain = (html?: string | null) =>
  (html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

// "— careful workmanship …" and "for a two-storey home." read as continuations; make them stand alone
const sentence = (text?: string | null) => {
  const clean = plain(text).replace(/^[—–-]\s*/, '')
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : ''
}

const withStop = (title: string) => (/[.!?]$/.test(title) ? title : `${title}.`)

type GalleryImage = { image: Media; caption?: string }

/* ---------- projects: photos and cards ---------- */

// every project photo in the record, once each, keeping its size and description
function projectImages(project: Project): Media[] {
  const found = new Map<string, Media>()
  const walk = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) return value.forEach(walk)
    const record = value as Record<string, unknown>
    const url = record.url
    if (typeof url === 'string' && url.startsWith('/media/projects/') && !found.has(url)) {
      found.set(url, { url, alt: (record.alt as string) || project.title || '', width: record.width as number, height: record.height as number })
    }
    Object.values(record).forEach(walk)
  }
  walk(project)
  return [...found.values()]
}

export function projectCards(): (SnowCardData & { slug: string; filters: string[] })[] {
  return getAllProjects().map((project) => ({
    slug: project.slug,
    filters: project.filters || [],
    title: project.title || project.slug,
    eyebrow: project.category,
    text: project.short_description,
    url: `/projects/${project.slug}`,
    image: projectImages(project)[0] || project.meta?.image || null,
  }))
}

// photos from the listed projects, two from each, captioned so it is clear where they come from
function photosFrom(slugs: string[] = [], perProject = 2): GalleryImage[] {
  const projects = getAllProjects()
  return slugs.flatMap((slug) => {
    const project = projects.find((item) => item.slug === slug)
    if (!project) return []
    return projectImages(project)
      .slice(0, perProject)
      .map((image) => ({ image, caption: `From ${project.title}` }))
  })
}

function cardsFor(slugs: string[] = []) {
  const cards = projectCards()
  return slugs.map((slug) => cards.find((card) => card.slug === slug)).filter((card): card is NonNullable<typeof card> => Boolean(card))
}

// product photos are listed by address; their sizes come from the category items that use them
function productImage(url: string): Media {
  for (const category of getProductCategories()) {
    if (category.image?.url === url) return category.image
    const item = category.items.find((entry) => entry.image?.url === url)
    if (item?.image) return item.image
  }
  return { url, alt: '', width: 1200, height: 900 }
}

/* ---------- products ---------- */

export function productOverview(slug: string): OverviewData | null {
  const product = getProductOverview(slug)
  if (!product) return null
  const category = getProductCategories().find((item) => item.slug === product.category)
  const work = cardsFor(product.projects)
  return {
    name: product.name,
    eyebrow: product.eyebrow,
    tagline: product.tagline,
    model: product.model,
    priceLine: `UGX ${product.priceText} ${product.price.unit}`,
    primary: { label: 'Order', url: '/contact' },
    secondary: { label: 'See the price list', url: '/price-list' },
    highlights: product.highlights,
    story: product.story,
    gallery: {
      title: 'Take a look around.',
      images: [
        ...(product.images || []).map((url) => ({ image: { ...productImage(url), alt: productImage(url).alt || product.name } })),
        ...photosFrom(product.projects, 1),
      ],
    },
    details: { title: 'Specs.', items: product.specs },
    compare: { title: product.compare.title, unit: product.price.unit, rows: product.compareRows },
    work: work.length ? { title: `Where the ${product.name} went.`, items: work } : undefined,
    cta: {
      title: `Ready to build with the ${product.name}?`,
      text: 'Tell us how much you need and where to deliver. We confirm availability and a quote.',
      secondary: category ? { label: `All ${category.title}`, url: `/products/${category.slug}` } : undefined,
    },
  }
}

/* ---------- product categories ---------- */

export function categoryOverview(slug: string): OverviewData | null {
  const category = getProductCategories().find((item) => item.slug === slug)
  if (!category) return null
  const products = getProductSpecs().filter((product) => product.category === slug)
  const prices = category.priceTables?.length ? getPriceList(category.priceTables) : undefined
  const work = cardsFor(category.projects)
  return {
    name: category.title,
    eyebrow: 'Products',
    tagline: category.short || '',
    model: category.model || 'hollow-block',
    primary: { label: 'Order', url: '/contact' },
    secondary: { label: 'See the price list', url: '/price-list' },
    highlights: category.items.slice(0, 4).map((item) => ({ title: item.title, text: item.description || '' })),
    story: category.items.slice(0, 3).map((item) => ({ title: withStop(item.title), text: item.description || '' })),
    gallery: {
      title: 'What we make.',
      images: [
        ...category.items.flatMap((item) => (item.image ? [{ image: { ...item.image, alt: item.image.alt || item.title }, caption: item.title }] : [])),
        ...photosFrom(category.projects, 1),
      ],
    },
    priceList: prices?.tables.length ? prices : undefined,
    related: products.length
      ? {
          title: 'Explore the products.',
          items: products.map((product) => ({
            title: product.name,
            eyebrow: product.eyebrow,
            text: product.tagline,
            url: `/products/${product.slug}`,
            image: product.images?.[0] ? productImage(product.images[0]) : category.image,
          })),
        }
      : undefined,
    work: work.length ? { title: 'See them on site.', items: work } : undefined,
    cta: {
      title: `Need ${category.title.toLowerCase()} for your project?`,
      text: 'Tell us what you need, the quantities and where to deliver. We confirm availability and a quote.',
      secondary: { label: 'See the price list', url: '/price-list' },
    },
  }
}

/* ---------- services ---------- */

export function serviceCards(): (SnowCardData & { slug: string; group: string })[] {
  return getServiceCategories().flatMap((group) =>
    group.items.map((item) => ({
      slug: item.slug,
      group: group.title,
      title: item.title,
      eyebrow: group.title,
      text: item.short,
      url: `/services/${item.slug}`,
      image: item.image,
    })),
  )
}

export function serviceOverview(slug: string): OverviewData | null {
  for (const group of getServiceCategories()) {
    const item = group.items.find((service) => service.slug === slug)
    if (!item) continue
    const work = cardsFor(item.projects)
    return {
      name: item.title,
      eyebrow: group.title,
      tagline: item.short || '',
      model: item.model || 'construction',
      primary: { label: 'Start your project', url: '/contact' },
      secondary: { label: 'All services', url: '/services' },
      highlights: (item.features || []).map((feature) => ({ title: feature.title || '', text: feature.description || '' })),
      story: (item.steps || []).map((step) => ({ title: withStop(step.title || ''), text: step.description || '' })),
      included: item.list?.length ? { title: 'What’s included.', items: item.list } : undefined,
      cards: item.deliverables?.length
        ? {
            title: 'What you get.',
            items: item.deliverables.map((deliverable) => ({ title: deliverable.title || '', text: deliverable.description })),
          }
        : undefined,
      gallery: {
        title: 'On site.',
        images: [...(item.image ? [{ image: item.image }] : []), ...photosFrom(item.projects)],
      },
      work: work.length ? { title: `${item.title} in our projects.`, items: work } : undefined,
      related: {
        title: `More in ${group.title}.`,
        items: serviceCards().filter((card) => card.group === group.title && card.slug !== slug),
      },
      cta: {
        title: `Start your ${item.title.toLowerCase()} project.`,
        text: 'Tell us about your plans, your site and your budget. We will get back to you with next steps.',
        secondary: { label: 'All services', url: '/services' },
      },
    }
  }
  return null
}

/* ---------- projects ---------- */

export function projectOverview(slug: string): OverviewData | null {
  const project = getAllProjects().find((item) => item.slug === slug)
  if (!project) return null
  const about: Block = (project.layout || []).find((block: Block) => block.blockType === 'about_project') || { blockType: 'about_project' }
  const items = (list?: { title?: string; description?: string }[]) =>
    (list || []).map((entry) => ({ title: entry.title || '', text: sentence(entry.description) }))

  const story = [
    { title: 'About the project.', text: plain(about.intro_description) },
    { title: withStop(about.approach_title || 'Our approach'), text: plain(about.approach_description) },
    about.goals_items?.length
      ? { title: withStop(about.goals_title || 'Project priorities'), text: items(about.goals_items).slice(0, 2).map((goal) => `${goal.title}: ${goal.text}`).join(' ') }
      : { title: 'Handed over.', text: plain(about.conclusion_description) },
  ].filter((step) => step.text)

  const related = (project.relatedProjects || [])
    .map((ref) => projectCards().find((card) => card.slug === ref.slug))
    .filter((card): card is NonNullable<typeof card> => Boolean(card))

  // the services this project used, from the "Services" line in its details, plus every service that lists it
  const info: { label: string; value: string }[] = about.info_items || []
  const named = (info.find((entry) => entry.label === 'Services')?.value || '').toLowerCase()
  const used = serviceCards().filter((card) => {
    const listsProject = getServiceCategories().some((group) => group.items.some((item) => item.slug === card.slug && item.projects?.includes(slug)))
    return listsProject || named.includes(card.title.toLowerCase())
  })

  return {
    name: project.title || slug,
    eyebrow: project.category || undefined,
    tagline: project.short_description || '',
    model: project.model || 'construction',
    storeys: project.model_storeys,
    primary: { label: 'Start a similar project', url: '/contact' },
    secondary: { label: 'All projects', url: '/projects' },
    highlights: items(about.delivered_items),
    story,
    gallery: { title: 'Take a look around.', images: projectImages(project).map((image) => ({ image })) },
    details: { title: 'Project details.', items: info.map((entry) => ({ label: entry.label, value: entry.value })) },
    work: used.length ? { title: 'Services on this project.', items: used } : undefined,
    related: related.length ? { title: 'More of our work.', items: related } : undefined,
    cta: {
      title: 'Planning something similar?',
      text: 'Tell us about your project, your site and your budget. We will get back to you with next steps.',
      secondary: { label: 'All projects', url: '/projects' },
    },
  }
}
