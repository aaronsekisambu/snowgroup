import type { Metadata } from 'next/types'
import { CollectionTeam } from '@/components/CollectionTeam'
import { Pagination } from '@/components/Pagination'
import PageClient from './page.client'
import { getTeam, getTeamPage } from '@/lib/content'
import type { TeamPage, Page } from '@/types/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { sanitizeHTML } from '@/utilities/sanitizeHtml'
import { generateMeta } from '@/utilities/generateMeta'

export default async function Page() {
  const teamData: TeamPage = getTeamPage()
  const team = getTeam(1, 8)

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

export async function generateMetadata(): Promise<Metadata> {
  const teamData: TeamPage = getTeamPage()
  const pageTeamData: Page = {
    title: '',
    layout: [],
    meta: teamData.meta,
    slug: 'team',
  }
  return generateMeta({ doc: pageTeamData, path: '/team', noindex: true })
}
