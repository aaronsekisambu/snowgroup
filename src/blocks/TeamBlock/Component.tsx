import React from 'react'
import type { Team, TeamBlock as TeamBlockProps } from '@/types/content'
import { queryTeamBlock } from '@/lib/content'
import type { CardTeamData } from '@/components/TeamCard'
import { TeamCard } from '@/components/TeamCard'
import Link from "next/link"
import { sanitizeHTML } from '@/utilities/sanitizeHtml'

export const TeamBlock: React.FC<TeamBlockProps> = async (props) => {
  const {
    badge,
    title,
    description,
    button_text,
    button_url,
    categories,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    items,
  } = props

  const limit = (limitFromProps as number) || 3

  let team: CardTeamData[] = Array.isArray(items) ? (items as CardTeamData[]) : []

  if (!team.length && populateBy === 'collection') {
    const flattenedCategories = (categories as { slug?: string; title?: string }[] | undefined)?.map((category) => {
      if (typeof category === 'object') return category.slug || category.title
      return String(category)
    })
    team = queryTeamBlock(flattenedCategories, limit)
  } else if (!team.length && selectedDocs) {
    team = (selectedDocs as { value?: Team }[]).map((post) => post.value).filter(Boolean) as CardTeamData[]
  }

  return (
    <div className="mil-section mil-p-10-6">
      <div className="container">
        <div className="row mil-aie mil-mb-10">
          <div className="col-12 col-lg-6 mil-md-mb-4">
            {badge && <div className="mil-badge mil-mb-4">{String(badge)}</div>}
            {title && (
              <h2
                className="mil-c-m-1"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(title)) }}
              />
            )}
          </div>
          <div className="col-12 col-md-6">
            <div className="mil-flex-column mil-jce mil-aie mil-md-ais">
              {description && (
                <p className="mil-c-m-2 mil-t-14 mil-mb-3" dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(description)) }} />
              )}
              {button_text && button_url && (
                <Link href={String(button_url)} className="mil-btn mil-link-type mil-dark">
                  <span>{String(button_text)}</span>
                  <i className="far fa-arrow-right"></i>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          {team.map((item, index) => (
            <div key={index} className="col-6 col-lg-3">
              <TeamCard doc={item} relationTo="team" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}