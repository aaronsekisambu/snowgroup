import React, { Fragment } from 'react'

import type { Block } from '@/types/content'
import { BlockErrorBoundary } from '@/components/BlockErrorBoundary'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroOneBlock } from '@/blocks/HeroOne/Component'
import { HeroTwoBlock } from '@/blocks/HeroTwo/Component'
import { HeroThreeBlock } from '@/blocks/HeroThree/Component'
import { HeroFourBlock } from '@/blocks/HeroFour/Component'
import { HeroFiveBlock } from '@/blocks/HeroFive/Component'
import { AboutUsBlock } from '@/blocks/AboutUs/Component'
import { AboutUsTwoBlock } from '@/blocks/AboutUsTwo/Component'
import { AboutUsThreeBlock } from '@/blocks/AboutUsThree/Component'
import { AboutUsFourBlock } from '@/blocks/AboutUsFour/Component'
import { CountersBlock } from '@/blocks/Counters/Component'
import { CountersTwoBlock } from '@/blocks/CountersTwo/Component'
import { ServicesBlock } from '@/blocks/ServicesBlock/Component'
import { ServicesTwoBlock } from '@/blocks/ServicesTwo/Component'
import { ServicesThreeBlock } from '@/blocks/ServicesThree/Component'
import { ServicesFourBlock } from '@/blocks/ServicesFour/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { TeamBlock } from '@/blocks/TeamBlock/Component'
import { CallToAction2Block } from '@/blocks/CallToAction2/Component'
import { SubscribeBlock } from '@/blocks/SubscribeBlock/Component'
import { PortfolioBlock } from '@/blocks/PortfolioBlock/Component'
import { PortfolioTwoBlock } from '@/blocks/PortfolioTwo/Component'
import { PricesBlock } from '@/blocks/PricesBlock/Component'
import { PricesTwo } from '@/blocks/PricesTwo/Component'
import { IntroBlock } from '@/blocks/Intro/Component'
import { PortfolioGrid } from '@/blocks/PortfolioGrid/Component'
import { AboutProjectBlock } from '@/blocks/AboutProject/Component'
import { AboutServiceBlock } from '@/blocks/AboutService/Component'
import { AboutTeamBlock } from '@/blocks/AboutTeam/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { FeaturesTwoBlock } from '@/blocks/FeaturesTwo/Component'
import { ProcessBlock } from '@/blocks/Process/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { LegalBlock } from '@/blocks/Legal/Component'
import { PlanTabsBlock } from '@/blocks/PlanTabs/Component'
import { FaqBlock } from '@/blocks/FaqBlock/Component'
import { ReusableBlock } from './ReusableContent/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  hero_one: HeroOneBlock,
  hero_two: HeroTwoBlock,
  hero_three: HeroThreeBlock,
  hero_four: HeroFourBlock,
  hero_five: HeroFiveBlock,
  about_us: AboutUsBlock,
  about_us_two: AboutUsTwoBlock,
  about_us_three: AboutUsThreeBlock,
  about_us_four: AboutUsFourBlock,
  counters: CountersBlock,
  counters_two: CountersTwoBlock,
  services: ServicesBlock,
  services_two: ServicesTwoBlock,
  services_three: ServicesThreeBlock,
  services_four: ServicesFourBlock,
  call_to_action: CallToActionBlock,
  team_block: TeamBlock,
  call_to_action_2: CallToAction2Block,
  subscribe: SubscribeBlock,
  portfolio: PortfolioBlock,
  portfolio_two: PortfolioTwoBlock,
  prices_block: PricesBlock,
  prices_two: PricesTwo,
  intro: IntroBlock,
  portfolio_grid: PortfolioGrid,
  about_project: AboutProjectBlock,
  about_service: AboutServiceBlock,
  about_team: AboutTeamBlock,
  features: FeaturesBlock,
  features_two: FeaturesTwoBlock,
  process: ProcessBlock,
  testimonials: TestimonialsBlock,
  legal: LegalBlock,
  plan_tabs: PlanTabsBlock,
  faq: FaqBlock,
  reusable_block: ReusableBlock,
}

export const RenderBlocks: React.FC<{
  blocks?: Block[] | null
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <Fragment key={index}>
                  <BlockErrorBoundary>
                    <Block {...block} disableInnerContainer />
                  </BlockErrorBoundary>
                </Fragment>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
