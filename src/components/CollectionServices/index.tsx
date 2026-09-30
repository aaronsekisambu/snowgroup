import React from 'react'

import { ServiceCard, CardServiceData } from '@/components/ServiceCard'

export type Props = {
  posts: CardServiceData[]
}

export const CollectionServices: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className="row">
      {posts?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className="col-md-6 col-xl-4" key={index}>
                <ServiceCard doc={result} relationTo="services" />
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}