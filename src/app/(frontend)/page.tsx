import type { Metadata } from 'next'
import React, { Fragment } from 'react'
import { notFound } from 'next/navigation'
import type { Page } from '@/types/content'
import { getPageBySlug, HOME_PAGE_SLUG } from '@/lib/content'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './[slug]/page.client'

export default async function HomePage(): Promise<React.ReactElement> {
	const page: Page | null = getPageBySlug(HOME_PAGE_SLUG)

	if (!page) notFound()

	return (
		<Fragment>
			<PageClient page={page} />
			<RenderBlocks blocks={page.layout || []} />
		</Fragment>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	return generateMeta({ doc: getPageBySlug(HOME_PAGE_SLUG), path: '/' })
}
