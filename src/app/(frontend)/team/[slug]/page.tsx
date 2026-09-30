import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Team } from '@/types/content'
import { RelatedPosts } from '@/components/RelatedTeam/Component'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getAllTeamSlugs, getTeamBySlug } from '@/lib/content'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function TeamPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const team = getTeamBySlug(decodeURIComponent(slug))
  if (!team) notFound()

  return (
    <Fragment>
      <PageClient />
      <RenderBlocks blocks={team.layout || []} />
      {team.relatedTeam && team.relatedTeam.length > 0 && (
        <RelatedPosts
          limit={4}
          docs={team.relatedTeam.filter((item: Team) => typeof item === 'object')}
          postId={team.slug}
        />
      )}
    </Fragment>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const team = getTeamBySlug(decodeURIComponent(slug))
  return generateMeta({ doc: team })
}

export async function generateStaticParams() {
  return getAllTeamSlugs()
}
