import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import type { Project } from '@/types/content'
import { RelatedPosts } from '@/components/RelatedProjects/Component'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const project = getProjectBySlug(decodeURIComponent(slug))
  if (!project) notFound()

  return (
    <Fragment>
      <PageClient />
      <RenderBlocks blocks={project.layout || []} />
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <RelatedPosts
          limit={3}
          docs={project.relatedProjects.filter((item: Project) => typeof item === 'object')}
          postId={project.slug}
        />
      )}
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
