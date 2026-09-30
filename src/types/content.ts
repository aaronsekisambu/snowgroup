export type Media = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  mimeType?: string | null
  updatedAt?: string | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null } | undefined>
}

export type Category = {
  id?: string
  title?: string | null
  slug?: string | null
}

export type Meta = {
  title?: string | null
  description?: string | null
  image?: Media | null
}

export type CMSLink = {
  type?: 'custom' | 'reference' | null
  label?: string | null
  url?: string | null
  newTab?: boolean | null
  appearance?: string | null
  submenu?: SubMenuItem[] | null
  // Builds the submenu from a data source instead of `submenu`, e.g. 'service_categories'
  submenuSource?: string | null
  // Temporarily hides the item from the header without deleting it
  hidden?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts' | 'services' | 'projects' | 'team'
    value: { slug?: string | null } | string | number
  } | null
}

export type SubMenuItem = {
  sub_type?: 'custom' | 'reference' | null
  label?: string | null
  sub_url?: string | null
  sub_newTab?: boolean | null
  sub_reference?: {
    relationTo: 'pages' | 'posts' | 'services' | 'projects' | 'team'
    value: { slug?: string | null } | string | number
  } | null
  // When set, the item renders as a category heading with its own links
  sub_items?: SubMenuItem[] | null
  // When set, the item renders as a clickable category with this text underneath
  description?: string | null
}

export type Block = {
  blockType: string
  id?: string
  items?: unknown[]
  disableInnerContainer?: boolean
  // Block JSON fields differ by blockType; keep a loose bag for SSG content.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type Page = {
  id?: string
  title?: string | null
  slug: string
  layout?: Block[] | null
  meta?: Meta | null
  headerStyle?: string | null
  footerLayout?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  createdAt?: string | null
}

export type Author = {
  name?: string | null
  avatar?: Media | null
}

export type Post = {
  id?: string
  title?: string | null
  slug: string
  content?: string | null
  heroImage?: Media | null
  categories?: Category[] | null
  populatedAuthors?: Author[] | null
  author?: string | null
  publishedAt?: string | null
  relatedPosts?: Post[] | null
  meta?: Meta | null
  updatedAt?: string | null
}

export type Project = {
  id?: string
  title?: string | null
  slug: string
  short_description?: string | null
  price?: string | null
  category?: string | null
  // Portfolio filter groups, e.g. "Residential", "Agricultural"
  filters?: string[] | null
  client?: string | null
  location?: string | null
  layout?: Block[] | null
  categories?: Category[] | null
  relatedProjects?: Project[] | null
  meta?: Meta | null
  order?: number | null
  publishedAt?: string | null
  updatedAt?: string | null
}

export type Service = {
  id?: string
  title?: string | null
  slug: string
  short?: string | null
  list?: { id?: string; text?: string | null }[] | null
  layout?: Block[] | null
  categories?: Category[] | null
  relatedServices?: Service[] | null
  meta?: Meta | null
  order?: number | null
  updatedAt?: string | null
}

export type Team = {
  id?: string
  title?: string | null
  slug: string
  short?: string | null
  layout?: Block[] | null
  categories?: Category[] | null
  relatedTeam?: Team[] | null
  meta?: Meta | null
  order?: number | null
  updatedAt?: string | null
}

export type CollectionPageGlobal = {
  badge?: string | null
  title?: string | null
  description?: string | null
  layout_before?: Block[] | null
  layout_after?: Block[] | null
  post_layout_after?: Block[] | null
  meta?: Meta | null
}

export type Blog = CollectionPageGlobal
export type ProjectsPage = CollectionPageGlobal & {
  // Filter buttons shown above the projects, in this order
  filters?: string[] | null
}
export type ServicesPage = CollectionPageGlobal

type TitledText = { title?: string | null; description?: string | null }

export type ServiceCategoryItem = {
  title: string
  slug: string
  short?: string | null
  // Page content; anything left out falls back to the service template
  image?: Media | null
  list?: string[] | null
  right_title?: string | null
  description?: string | null
  features?: TitledText[] | null
  steps?: TitledText[] | null
  deliverables?: TitledText[] | null
}

export type ServiceCategory = {
  title: string
  slug: string
  items: ServiceCategoryItem[]
}

export type ProductCategory = {
  title: string
  slug: string
  short?: string | null
  image?: Media | null
  items: { title: string; description?: string | null; image?: Media | null }[]
}

// A product category page, rendered from the shared product template
export type ProductPage = {
  slug: string
  title?: string | null
  meta?: Meta | null
  layout?: Block[] | null
}

// Shared layout for every category service; {{title}}, {{short}} and {{category}} are filled per item
export type ServiceTemplate = {
  meta?: Meta | null
  layout?: Block[] | null
}
export type TeamPage = CollectionPageGlobal

export type Header = {
  headerStyle?: string | null
  logo?: {
    type?: string | null
    text?: string | null
    fontawesome_icon?: string | null
    link?: string | null
    logo?: Media | null
    logo_invert?: Media | null
    // Word shown next to the logo once the header gets its solid background
    scroll_text?: string | null
  } | null
  navItems?: { link?: CMSLink }[] | null
  contact?: {
    label?: string | null
    link?: string | null
    fontawesome_icon?: string | null
    actionType?: string | null
    popupTitle?: string | null
    popupItems?: { label?: string | null; value?: string | null; link?: string | null }[] | null
    formTitle?: string | null
    form?: Form | null
  } | null
  ordercall?: {
    formTitle?: string | null
    form?: Form | null
    bgImage?: Media | null
  } | null
  [key: string]: unknown
}

export type Footer = {
  layoutType?: string | null
  logo?: Media | null
  logoLight?: Media | null
  // Company name shown in bold next to the footer logo
  logo_text?: string | null
  // Short call to action under the footer logo
  cta?: { text?: string | null; button_text?: string | null; button_url?: string | null } | null
  backgroundImage?: Media | null
  newsletter?: { placeholder?: string; buttonIcon?: string } | null
  mainMenu?: { label?: string; link?: string }[] | null
  policyLinks?: { label?: string; link?: string }[] | null
  social?: { icon?: string; link?: string }[] | null
  footerLinks?: { label?: string; link?: string }[] | null
  // phone_link overrides the default tel: link, e.g. a WhatsApp chat link
  locations?: { title?: string; address?: string; phone?: string; phone_link?: string; email?: string }[] | null
  copyright?: string | null
  createdBy?: string | null
  [key: string]: unknown
}

export type General = {
  not_found?: {
    bgImage?: Media | null
    title?: string | null
    subtitle?: string | null
    description?: string | null
  } | null
}

export type ReusableContent = {
  id?: string
  slug?: string
  title?: string | null
  layout?: Block[] | null
}

export type ReusableBlock = Block

export type Redirect = {
  from?: string
  to?: string
  statusCode?: number
}

export type FormField = {
  blockType: string
  name: string
  label?: string
  defaultValue?: string | number
  required?: boolean
  width?: number | string
  message?: string
  options?: { label?: string; value?: string }[]
} & Record<string, unknown>

export type Form = {
  id?: string
  slug?: string
  title?: string | null
  submitButtonLabel?: string | null
  confirmationType?: string | null
  confirmationMessage?: string | null
  redirect?: { url?: string | null } | null
  fields?: FormField[] | null
}

export type AppSettings = {
  settings?: {
    siteName?: string
    siteDescription?: string
    formspreeURL?: string
    mailchimp?: { url?: string; key?: string }
    perPage?: number
  }
}

export type Paginated<T> = {
  docs: T[]
  page: number
  totalPages: number
  totalDocs: number
  limit: number
}

export type ArchiveBlock = Block
export type ContentBlock = Block
export type FormBlock = Block
export type MediaBlock = Block
export type HeroOneBlock = Block
export type HeroTwoBlock = Block
export type HeroThreeBlock = Block
export type HeroFourBlock = Block
export type HeroFiveBlock = Block
export type AboutUsBlock = Block
export type AboutUsTwoBlock = Block
export type AboutUsThreeBlock = Block
export type AboutUsFourBlock = Block
export type CountersBlock = Block
export type CountersTwoBlock = Block
export type ServicesBlock = Block
export type ServicesTwoBlock = Block
export type ServicesThreeBlock = Block
export type ServicesFourBlock = Block
export type CallToActionBlock = Block
export type CallToAction2Block = Block
export type TeamBlock = Block
export type SubscribeBlock = Block
export type PortfolioBlock = Block
export type PortfolioTwoBlock = Block
export type Plan = {
  name?: string | null
  tier?: string | null
  tagline?: string | null
  price?: string | null
  price_suffix?: string | null
  description?: string | null
  features?: { item?: string | null; disabled?: boolean | null }[] | null
  button_text?: string | null
  button_url?: string | null
  button_style?: string | null
  // Shows the button greyed out and not clickable, e.g. "Coming soon"
  button_disabled?: boolean | null
  card_style?: string | null
}

export type PricesBlock = Block
export type PricesTwoBlock = Block
export type IntroBlock = Block
export type PortfolioGrid = Block
export type AboutProjectBlock = Block
export type AboutServiceBlock = Block
export type AboutTeamBlock = Block
export type FeaturesBlock = Block
export type FeaturesTwoBlock = Block
export type ProcessBlock = Block
export type FaqBlock = Block
export type Faq = {
  question?: string | null
  answer?: string | null
}
export type TestimonialsBlock = Block
export type LegalBlock = Block
export type PlanTabsBlock = Block

export type TextField = FormField
export type EmailField = FormField
export type CheckboxField = FormField
export type SelectField = FormField
export type StateField = FormField
export type CountryField = FormField
export type FormFieldBlock = FormField
