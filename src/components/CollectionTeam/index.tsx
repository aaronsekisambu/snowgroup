import React from 'react'

import { TeamCard, CardTeamData } from '@/components/TeamCard'

export type Props = {
  posts: CardTeamData[]
  angleGray?: boolean
}

export const CollectionTeam: React.FC<Props> = (props) => {
  const { posts, angleGray = false } = props
  
  return (
    <div className="row">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-6 col-lg-3" key={index}>
                <TeamCard doc={result} relationTo="team" angleGray={angleGray} />
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}