import type { Metadata } from 'next/types'
import { CollectionTeam } from '@/components/CollectionTeam'
import { Pagination } from '@/components/Pagination'
import PageClient from '../../page.client'
import { notFound } from 'next/navigation'
import { getAllTeam, getTeam, getTeamPage } from '@/lib/content'
import type { TeamPage } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const teamData: TeamPage = getTeamPage()
  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()
  const team = getTeam(sanitizedPageNumber, 8)

  return (
    <>
      <PageClient />
      {teamData.layout_before && <RenderBlocks blocks={teamData.layout_before} />}
      <div className="mil-section mil-p-10-6">
        <div className="container">
          <div className="row mil-aie mil-mb-10">
            <div className="col-12 col-md-6 mil-sm-mb-4">
              {teamData.badge && <div className="mil-badge mil-mb-4">{teamData.badge}</div>}
              {teamData.title && (
                <h2 className="mil-c-m-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(teamData.title) }} />
              )}
            </div>
            <div className="col-12 col-md-6">
              <div className="mil-flex-column mil-jce">
                {teamData.description && (
                  <p className="mil-c-m-2 mil-t-16" dangerouslySetInnerHTML={{ __html: sanitizeHTML(teamData.description) }} />
                )}
              </div>
            </div>
          </div>
          <CollectionTeam posts={team.docs} />
          {team.totalPages > 1 && team.page && (
            <Pagination pageType={'team'} page={team.page} totalPages={team.totalPages} />
          )}
        </div>
      </div>
      {teamData.layout_after && <RenderBlocks blocks={teamData.layout_after} />}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const teamData: TeamPage = getTeamPage()
  return {
    title: `${teamData.meta?.title} | Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const totalPages = Math.ceil(getAllTeam().length / 8)
  const pages: { pageNumber: string }[] = []
  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }
  return pages
}
