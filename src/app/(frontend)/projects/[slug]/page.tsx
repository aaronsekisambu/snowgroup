import type { Metadata } from 'next'
import { breadcrumbList, JsonLd } from '@/components/StructuredData/JsonLd'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { Overview } from '@/components/Overview'
import { generateMeta } from '@/utilities/generateMeta'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content'
import { projectOverview } from '@/lib/overview'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const project = getProjectBySlug(decodeURIComponent(slug))
  const data = projectOverview(decodeURIComponent(slug))
  if (!project || !data) notFound()

  return (
    <Fragment>
      <JsonLd data={breadcrumbList([{ name: 'Projects', path: '/projects' }, { name: project.title, path: `/projects/${project.slug}` }])} />
      <Overview data={data} />
    </Fragment>
  )
}

export async function generateStaticParams() {
  return getAllProjectSlugs()
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const project = getProjectBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: project, path: `/projects/${slug}` })
}
